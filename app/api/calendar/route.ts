import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ─── Google Calendar Auth ───
const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

// ─── Supabase User Auth ───
async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  return data.user;
}

// ─── Utilitaire : Extraire données d'une description ───
function parseColorVisibility(description: string = "#3b82f6::public::") {
  const [color, visibility, details] = description.split("::");
  return {
    color: color || "#3b82f6",
    visibility: visibility || "public",
    details: details || "",
  };
}

// ─── GET : Récupérer les événements ───
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

    const events = (response.data.items || [])
      .filter((event) => {
        const { visibility } = parseColorVisibility(event.description || "");
        return visibility === "public" || isAuthenticated;
      })
      .map((event) => {
        const { color, visibility, details } = parseColorVisibility(event.description || "");
        const start = event.start?.dateTime || (event.start?.date ? new Date(event.start.date + "T00:00:00").toISOString() : null);
        const end = event.end?.dateTime || (event.end?.date ? new Date(new Date(event.end.date).getTime() - 1).toISOString() : null);

        return {
          id: event.id,
          summary: event.summary,
          description: `${color}::${visibility}::${details}`,
          start: { dateTime: start },
          end: { dateTime: end },
          location: event.location || "",
        };
      });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Erreur API Google Calendar", error);
    return NextResponse.json({ error: "Impossible de récupérer les événements" }, { status: 500 });
  }
}

// ─── POST : Créer un événement ───
export async function POST(req: NextRequest) {
  try {
    const { title, start, end, color, location, description } = await req.json();
    const user = await getUserFromRequest(req);
    const isAuthenticated = !!user;

    const { color: parsedColor, visibility } = parseColorVisibility(color);
    const safeVisibility = visibility === "private" && isAuthenticated ? "private" : "public";

    const event = {
      summary: title,
      location: location || "",
      description: `${parsedColor}::${safeVisibility}::${description || ""}`,
      start: { dateTime: new Date(start).toISOString(), timeZone: "Europe/Paris" },
      end: { dateTime: new Date(end).toISOString(), timeZone: "Europe/Paris" },
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

// ─── PUT : Modifier un événement ───
export async function PUT(req: NextRequest) {
  try {
    const { id, title, start, end, color, location, description } = await req.json();
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    await calendar.events.update({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      eventId: id,
      requestBody: {
        summary: title,
        location: location || "",
        description: color, // déjà formaté en "color::visibility::desc"
        start: {
          dateTime: new Date(start).toISOString(),
          timeZone: "Europe/Paris",
        },
        end: {
          dateTime: new Date(end).toISOString(),
          timeZone: "Europe/Paris",
        },
      },
    });

    return NextResponse.json({ message: "Événement mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur mise à jour événement:", error);
    return NextResponse.json({ error: "Impossible de mettre à jour l'événement" }, { status: 500 });
  }
}

// ─── DELETE : Supprimer un événement ───
export async function DELETE(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

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
