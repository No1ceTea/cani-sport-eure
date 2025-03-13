import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});
const calendar = google.calendar({ version: "v3", auth });

// ─── GET : Récupérer les événements ─────────────────────────────────────────────
export async function GET() {
  try {
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    return NextResponse.json(response.data.items || []);
  } catch (error) {
    console.error("Erreur API Google Calendar", error);
    return NextResponse.json({ error: "Impossible de récupérer les événements" }, { status: 500 });
  }
}

// ─── POST : Ajouter un événement ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { title, start, end } = await req.json();
    const event = {
      summary: title,
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

// ─── DELETE : Supprimer un événement ───────────────────────────────────────────
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
