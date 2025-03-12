"use client";

import { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;
const CALENDAR_ID = process.env.NEXT_PUBLIC_CALENDAR_ID!;
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
}

export default function GoogleCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  useEffect(() => {
    function initClient() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
          scope: SCOPES,
        })
        .then(() => {
          const authInstance: gapi.auth2.GoogleAuth = gapi.auth2.getAuthInstance();
          setIsSignedIn(authInstance.isSignedIn.get());

          authInstance.isSignedIn.listen((signedIn: boolean) => {
            setIsSignedIn(signedIn);
            if (signedIn) fetchEvents();
          });

          if (authInstance.isSignedIn.get()) fetchEvents();
        })
        .catch((error: any) => {
          console.error("Erreur d'initialisation de l'API :", error);
        });
    }

    gapi.load("client:auth2,calendar", initClient);
  }, []);

  const fetchEvents = () => {
    interface EventsResponse {
      result: {
        items: CalendarEvent[];
      };
    }

    gapi.client.calendar.events
      .list({
        calendarId: CALENDAR_ID,
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      })
      .then((response: EventsResponse) => {
        if (response.result.items) {
          setEvents(response.result.items);
        } else {
          console.warn("Aucun événement trouvé !");
        }
      })
      .catch((error: any) => {
        console.error("Erreur lors de la récupération des événements :", error);
      });
  };

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
    setEvents([]);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Agenda Google</h2>
      {isSignedIn ? (
        <>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
          >
            Déconnexion
          </button>
          <ul className="list-disc pl-4">
            {events.length > 0 ? (
              events.map((event) => (
                <li key={event.id} className="mb-2">
                  {event.summary} - {event.start.dateTime || event.start.date}
                </li>
              ))
            ) : (
              <p>Aucun événement disponible.</p>
            )}
          </ul>
        </>
      ) : (
        <button
          onClick={handleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Connexion avec Google
        </button>
      )}
    </div>
  );
}
