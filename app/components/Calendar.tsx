"use client";

import "moment/locale/fr";
import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import supabase from "@/lib/supabaseClient";
import ModalConfirm from "./ModalConfirm";

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

interface CalendarProps {
  readOnly?: boolean;
  hidePrivate?: boolean;
}

export default function MyCalendar({ readOnly = false, hidePrivate = false }: CalendarProps) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("#3b82f6");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [userToken, setUserToken] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token || null;
      setUserToken(token);
      fetchEvents(token);
    };
    fetchUserAndEvents();
  }, []);

  const fetchEvents = async (token: string | null = null) => {
    try {
      const res = await fetch("/api/calendar", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(
          data
            .filter((event: any) => {
              const isPrivate = event.visibility === "private";
              return !(hidePrivate && isPrivate);
            })
            .map((event: any) => {
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
    if (readOnly) return;
    setStartDate(start.toISOString().slice(0, 10));
    setStartTime(start.toTimeString().slice(0, 5));
    setEndDate(end.toISOString().slice(0, 10));
    setEndTime(end.toTimeString().slice(0, 5));
    setShowModal(true);
  };

  const handleSelectEvent = (event: EventData) => {
    if (readOnly) return;
    setSelectedEventId(event.id);
    setShowDeleteModal(true);
  };

  const handleCreateEvent = async () => {
    if (!newTitle || !startDate || !startTime || !endDate || !endTime) {
      alert("Tous les champs sont obligatoires.");
      return;
    }
  
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
  
    const fullColor = `${newColor}::${visibility}`;
  
    const res = await fetch("/api/calendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(userToken && { Authorization: `Bearer ${userToken}` }), // 🔐 ajoute le token seulement s’il existe
      },
      body: JSON.stringify({
        title: newTitle,
        start,
        end,
        color: fullColor,
      }),
    });
  
    if (res.ok) {
      fetchEvents(userToken);
      resetForm();
      setShowModal(false);
    } else {
      const errorText = await res.text();
      console.error("❌ Erreur lors de la création :", errorText);
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
    setVisibility("public");
  };

  const deleteEvent = async (eventId: string) => {
    if (!eventId) return;

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
    const isSameDay = start.toLocaleDateString() === end.toLocaleDateString();
    const formatDate = (d: Date) => d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formatHour = (d: Date) => d.toLocaleTimeString("fr-FR", {
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

  console.log("GOOGLE_SERVICE_ACCOUNT_EMAIL:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
  console.log("GOOGLE_CALENDAR_ID:", process.env.GOOGLE_CALENDAR_ID);
  console.log("GOOGLE_PRIVATE_KEY exists:", !!process.env.GOOGLE_PRIVATE_KEY);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">📅 Agenda</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable={!readOnly}
        style={{ height: 500 }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
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

      {showModal && !readOnly && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold mb-4">Créer un événement</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateEvent();
                setShowModal(false);
              }}
            >
              <label className="block mb-2">
                Titre :
                <input type="text" required className="ml-2 border p-1 w-full" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </label>
              <label className="block mb-2">
                Début :
                <input type="date" required className="ml-2 border p-1" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input type="time" required className="ml-2 border p-1" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </label>
              <label className="block mb-2">
                Fin :
                <input type="date" required className="ml-2 border p-1" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <input type="time" required className="ml-2 border p-1" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </label>
              <label className="block mb-2">
                Couleur :
                <input type="color" className="ml-2 border p-1 w-16" value={newColor} onChange={(e) => setNewColor(e.target.value)} />
              </label>
              <label className="block mb-4">
                Visibilité :
                <select className="ml-2 border p-1" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                  <option value="public">🌍 Public</option>
                  <option value="private">🔒 Réservé aux membres</option>
                </select>
              </label>
              <div className="flex gap-2 justify-end">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">➕ Créer</button>
                <button type="button" onClick={() => { resetForm(); setShowModal(false); }} className="bg-gray-400 text-white px-4 py-2 rounded">❌ Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!readOnly && (
        <ModalConfirm
          isOpen={showDeleteModal}
          title="Supprimer l'événement ?"
          message="Cette action est irréversible."
          confirmText="Confirmer"
          cancelText="Annuler"
          onConfirm={() => {
            if (selectedEventId) {
              deleteEvent(selectedEventId);
              setShowDeleteModal(false);
              setSelectedEventId(null);
            }
          }}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedEventId(null);
          }}
        />
      )}
    </div>
  );
}