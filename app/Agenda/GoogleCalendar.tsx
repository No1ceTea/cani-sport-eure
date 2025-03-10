"use client";
import { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;
const CALENDAR_ID = process.env.NEXT_PUBLIC_CALENDAR_ID!;
const SCOPES = process.env.NEXT_PUBLIC_SCOPES!;

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
}

export default function GoogleCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    function start() {
      if (!gapi.client) {
        console.error("gapi.client n'est pas encore chargé !");
        return;
      }

      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
          scope: SCOPES,
        })
        .then(() => {
          return gapi.client.calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: new Date().toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 10,
            orderBy: "startTime",
          });
        })
        .then((response: any) => {
          if (response?.result?.items) {
            setEvents(response.result.items);
          } else {
            console.warn("Aucun événement trouvé !");
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des événements :", error);
        });
    }

    gapi.load("client:auth2", start);
  }, []);

  return (
    <div>
      <h2>Agenda public</h2>
      <ul>
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event.id}>
              {event.summary} - {event.start.dateTime || event.start.date}
            </li>
          ))
        ) : (
          <p>Aucun événement disponible.</p>
        )}
      </ul>
    </div>
  );
}