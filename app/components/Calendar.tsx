"use client";

import { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

interface EventData {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export default function MyCalendar() {
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    fetch("/api/calendar")
      .then((res) => res.json())
      .then((data) => {
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
      })
      .catch((err) => console.error("Erreur API Calendar:", err));
  }, []);

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
      setEvents([...events, { id: Math.random().toString(), ...newEvent }]);
    } else {
      alert("Erreur lors de l'ajout de l'événement.");
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
      />
    </div>
  );
}
