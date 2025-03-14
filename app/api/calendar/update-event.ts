import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});
const calendar = google.calendar({ version: "v3", auth });

export async function POST(req: NextRequest) {
  try {
    const { eventId, updatedEvent } = await req.json();
    const response = await calendar.events.update({
      calendarId: process.env.GOOGLE_CALENDAR_ID!,
      eventId,
      requestBody: updatedEvent,
    });
    return NextResponse.json({ message: "Événement mis à jour", event: response.data });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'événement", error);
    return NextResponse.json({ error: "Impossible de mettre à jour l'événement" }, { status: 500 });
  }
}
