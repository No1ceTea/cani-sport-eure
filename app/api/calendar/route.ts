import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const calendar = google.calendar({ version: "v3", auth: process.env.GOOGLE_API_KEY });
  
      const events = await calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID!,
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
      });
  
      console.log("Réponse Google Calendar:", events.data);
  
      return NextResponse.json(events.data.items || []); // ✅ Toujours un tableau
    } catch (error) {
      console.error("Erreur API Google Calendar", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json({ error: "Impossible de récupérer les événements", details: errorMessage }, { status: 500 });
    }
  }
  