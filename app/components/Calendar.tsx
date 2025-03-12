"use client";

import { useEffect, useState } from "react";

interface Event {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/calendar")
      .then(async (res) => {
        const text = await res.text(); // 🔍 Lire la réponse brute
        console.log("Réponse brute de l'API:", text);
        
        try {
          return JSON.parse(text); // 🔄 Parser seulement si c'est du JSON
        } catch (err) {
          throw new Error("Réponse non valide de l'API");
        }
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setError("Format de réponse invalide");
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des événements:", err);
        setError("Impossible de récupérer les événements");
      })
      .finally(() => setLoading(false));
  }, []);
  
  if (loading) return <p>Chargement des événements...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">📅 Prochains Événements</h2>
      {events.length === 0 ? (
        <p>Aucun événement trouvé.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id} className="mb-2">
              <span className="font-semibold">{event.summary}</span> -{" "}
              {event.start.dateTime
                ? new Date(event.start.dateTime).toLocaleString()
                : event.start.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
