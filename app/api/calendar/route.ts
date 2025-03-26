import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ─── AUTH Supabase depuis requête ─────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getUserFromRequest(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) return false;

  const { data } = await supabase.auth.getUser(token);
  return !!data?.user;
}

// ─── Google Calendar Auth ─────────────────────────────────────
const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

// ─── GET ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const isAuthenticated = await getUserFromRequest(req); // 🧠 vérifie token Supabase

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

// ─── POST ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { title, start, end, color, visibility } = await req.json();

    const event = {
      summary: title,
      start: { dateTime: new Date(start).toISOString(), timeZone: "Europe/Paris" },
      end: { dateTime: new Date(end).toISOString(), timeZone: "Europe/Paris" },
      description: `${color || "#3b82f6"}::${visibility || "public"}`,
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

// ─── DELETE ───────────────────────────────────────────────────────────
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