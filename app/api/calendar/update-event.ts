import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";  // Assurez-vous que le chemin est correct
import { google } from "googleapis";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId, updatedEvent } = await req.json();

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.user.accessToken });

    const calendar = google.calendar({ version: "v3", auth });

    const response = await calendar.events.update({
      calendarId: "primary",
      eventId,
      requestBody: updatedEvent,
    });

    return NextResponse.json({ message: "Événement mis à jour", event: response.data });
  } catch (error) {
    console.error("Erreur lors de la modification de l'événement", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
