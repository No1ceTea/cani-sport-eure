"use client";

import "moment/locale/fr";
import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("fr");
const localizer = momentLocalizer(moment);

interface EventData {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export default function MyCalendar() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/calendar");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(
          data.map((event: any) => ({
            id: event.id,
            title: event.summary,
            start: new Date(event.start.dateTime || event.start.date),
            end: new Date(event.end.dateTime || event.end.date),
          }))
        );
      }
    } catch (err) {
      console.error("Erreur API Calendar:", err);
    }
  };

  const handleSelectSlot = async ({ start, end }: { start: Date; end: Date }) => {
    const title = prompt("Nom de l'événement ?");
    if (!title) return;

    const newEvent = { title, start, end };

    const res = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    if (res.ok) {
      fetchEvents();
    } else {
      alert("Erreur lors de l'ajout de l'événement.");
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet événement ?")) return;

    const res = await fetch("/api/calendar", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: eventId }),
    });

    if (res.ok) {
      setEvents(events.filter((event) => event.id !== eventId));
    } else {
      alert("Erreur lors de la suppression.");
    }
  };

  const handleEdit = (event: EventData) => {
    setEditingEvent(event);
    setUpdatedTitle(event.title);
  };

  const handleUpdate = async () => {
    if (!editingEvent) return;
  
    const updatedEvent = {
      summary: updatedTitle,
      start: { dateTime: editingEvent.start.toISOString() },
      end: { dateTime: editingEvent.end.toISOString() },
    };
  
    const response = await fetch("/api/calendar/update-event", {  // ✅ Chemin correct
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: editingEvent.id, updatedEvent }),
    });
  
    if (response.ok) {
      alert("Événement mis à jour !");
      fetchEvents();
      setEditingEvent(null);
    } else {
      alert("Erreur lors de la mise à jour");
    }
  };
  

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">📅 Agenda</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        style={{ height: 500 }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={(event) => handleEdit(event)}
        messages={{
          allDay: "Journée entière",
          previous: "Précédent",
          next: "Suivant",
          today: "Aujourd'hui",
          month: "Mois",
          week: "Semaine",
          day: "Jour",
          agenda: "Agenda",
          date: "Date",
          time: "Heure",
          event: "Événement",
        }}
      />
      <ul className="mt-4">
        {events.map((event) => (
          <li key={event.id} className="border p-2 flex justify-between">
            <span>{event.title} - {event.start.toLocaleDateString("fr-FR")}</span>
            <div>
              <button
                onClick={() => handleEdit(event)}
                className="text-blue-500 hover:underline mr-2"
              >
                ✏️ Modifier
              </button>
              <button
                onClick={() => deleteEvent(event.id)}
                className="text-red-500 hover:underline"
              >
                🗑 Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingEvent && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="text-md font-semibold">Modifier l&apos;événement</h3>
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            className="border p-2 w-full mt-2"
          />
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white p-2 mt-2 rounded"
          >
            ✅ Sauvegarder
          </button>
          <button
            onClick={() => setEditingEvent(null)}
            className="ml-2 text-red-500 hover:underline"
          >
            ❌ Annuler
          </button>
        </div>
      )}
    </div>
  );
}
