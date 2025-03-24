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
  color?: string;
  allDay?: boolean;
}

export default function MyCalendar() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("#3b82f6");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/calendar");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(
          data.map((event: any) => {
            const start = new Date(event.start.dateTime || event.start.date);
            const end = new Date(event.end.dateTime || event.end.date);
            const allDay = !event.start.dateTime;

            return {
              id: event.id,
              title: event.summary,
              start,
              end,
              color: event.description || "#3b82f6",
              allDay,
            };
          })
        );
      }
    } catch (err) {
      console.error("Erreur API Calendar:", err);
    }
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setStartDate(start.toISOString().slice(0, 10));
    setStartTime(start.toTimeString().slice(0, 5));
    setEndDate(end.toISOString().slice(0, 10));
    setEndTime(end.toTimeString().slice(0, 5));
  };

  const handleCreateEvent = async () => {
    if (!newTitle || !startDate || !startTime || !endDate || !endTime) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    const res = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        start,
        end,
        color: newColor,
      }),
    });

    if (res.ok) {
      fetchEvents();
      resetForm();
    } else {
      alert("Erreur lors de la création.");
    }
  };

  const resetForm = () => {
    setNewTitle("");
    setNewColor("#3b82f6");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
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

  const eventStyleGetter = (event: EventData) => {
    const backgroundColor = event.color || "#3b82f6";
    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        color: "white",
        border: "none",
        padding: "4px",
      },
    };
  };

  const formatEventTime = (start: Date, end: Date) => {
    const isSameDay =
      start.toLocaleDateString() === end.toLocaleDateString();

    const formatDate = (d: Date) =>
      d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

    const formatHour = (d: Date) =>
      d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

    if (isSameDay) {
      return `${formatDate(start)} de ${formatHour(start)} à ${formatHour(end)}`;
    } else {
      return `Du ${formatDate(start)} à ${formatHour(start)} au ${formatDate(end)} à ${formatHour(end)}`;
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
        eventPropGetter={eventStyleGetter}
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

      {/* FORMULAIRE D’AJOUT MANUEL */}
      {startDate && startTime && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="text-md font-semibold mb-2">Créer un événement</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateEvent();
            }}
          >
            <label className="block mb-2">
              Titre :
              <input
                type="text"
                required
                className="ml-2 border p-1 w-full"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </label>

            <label className="block mb-2">
              Date de début :
              <input
                type="date"
                required
                className="ml-2 border p-1"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              Heure :
              <input
                type="time"
                required
                className="ml-2 border p-1"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </label>

            <label className="block mb-2">
              Date de fin :
              <input
                type="date"
                required
                className="ml-2 border p-1"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              Heure :
              <input
                type="time"
                required
                className="ml-2 border p-1"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </label>

            <label className="block mb-2">
              Couleur :
              <input
                type="color"
                className="ml-2 border p-1 w-16"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
              />
            </label>

            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                ➕ Créer
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                ❌ Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LISTE DES ÉVÉNEMENTS */}
      <ul className="mt-4">
        {events.map((event) => (
          <li
            key={event.id}
            className="border p-2 flex justify-between"
            style={{ backgroundColor: event.color || "#e5e7eb", color: "#111" }}
          >
            <span>
              {event.title} – {formatEventTime(event.start, event.end)}
            </span>
            <button
              onClick={() => deleteEvent(event.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              🗑 Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
