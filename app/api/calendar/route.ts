import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";


const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

// ─── Google Calendar Auth ───────────────────────────────────────────
console.log("GOOGLE_SERVICE_ACCOUNT_EMAIL:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
console.log("GOOGLE_CALENDAR_ID:", process.env.GOOGLE_CALENDAR_ID);
console.log("GOOGLE_PRIVATE_KEY exists:", !!process.env.GOOGLE_PRIVATE_KEY);
console.log("GOOGLE_PRIVATE_KEY (partielle):", process.env.GOOGLE_PRIVATE_KEY?.slice(0, 100));
console.log("GOOGLE_PRIVATE_KEY (longueur):", process.env.GOOGLE_PRIVATE_KEY?.length);
console.log("Compte utilisé pour auth Google :", auth.email);
console.log("Scopes utilisés pour auth Google :", auth.scopes);


try {
  await auth.authorize();
  console.log("Authentification Google réussie");
} catch (error) {
  console.error("Erreur d'authentification Google:", error);
}

const calendar = google.calendar({ version: "v3", auth });

// ─── Fonction d'authentification Supabase ───────────────────────────
async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    }
  );

  const { data } = await supabase.auth.getUser();
  return data.user;
}

// ─── GET : Récupérer les événements ─────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const isAuthenticated = !!user;

    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = (response.data.items || []).filter((event) => {
      const [, visibility] = (event.description || "#3b82f6::public").split("::");
      return visibility === "public" || isAuthenticated;
    }).map((event) => {
      const [color, visibility] = (event.description || "#3b82f6::public").split("::");

      const start = event.start?.dateTime || (event.start?.date ? new Date(event.start.date + "T00:00:00").toISOString() : null);
      const end = event.end?.dateTime || (event.end?.date ? new Date(new Date(event.end.date).getTime() - 1).toISOString() : null);

      return {
        ...event,
        description: `${color}::${visibility}`,
        start: { dateTime: start },
        end: { dateTime: end },
      };
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Erreur API Google Calendar", error);
    return NextResponse.json({ error: "Impossible de récupérer les événements" }, { status: 500 });
  }
}

// ─── POST : Ajouter un événement ────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { title, start, end, color, visibility } = await req.json();
    const user = await getUserFromRequest(req);

    // ✅ On autorise "private" seulement si connecté
    const isAuthenticated = !!user;
    const safeVisibility = visibility === "private" && isAuthenticated ? "private" : "public";

    const event = {
      summary: title,
      start: { dateTime: new Date(start).toISOString(), timeZone: "Europe/Paris" },
      end: { dateTime: new Date(end).toISOString(), timeZone: "Europe/Paris" },
      description: `${color || "#3b82f6"}::${safeVisibility}`,
    };

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      requestBody: event,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Erreur ajout événement:", error);
    return NextResponse.json({ error: "Impossible d'ajouter l'événement" }, { status: 500 });
  }
}

// ─── DELETE : Supprimer un événement ────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID de l'événement requis" }, { status: 400 });
    }

    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      eventId: id,
    });

    return NextResponse.json({ message: "Événement supprimé avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur suppression événement:", error);
    return NextResponse.json({ error: "Impossible de supprimer l'événement" }, { status: 500 });
  }
}
