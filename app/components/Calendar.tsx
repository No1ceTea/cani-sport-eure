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
  location?: string;
  description?: string;
}

interface CalendarProps {
  readOnly?: boolean;
  hidePrivate?: boolean;
}

function parseColorVisibility(description: string = "#3b82f6::public::") {
  const [color, visibility, details] = description.split("::");
  return {
    color: color || "#3b82f6",
    visibility: visibility || "public",
    description: details || "",
  };
}

function generateGoogleCalendarUrl(event: EventData) {
  const format = (date: Date) => date.toISOString().replace(/[-:]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const text = `&text=${encodeURIComponent(event.title)}`;
  const dates = `&dates=${format(event.start)}/${format(event.end)}`;
  const location = event.location ? `&location=${encodeURIComponent(event.location)}` : "";
  const details = event.description ? `&details=${encodeURIComponent(event.description)}` : "";

  return `${base}${text}${dates}${location}${details}`;
}

export default function MyCalendar({ readOnly = false, hidePrivate = false }: CalendarProps) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [eventToEdit, setEventToEdit] = useState<EventData | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  // Form fields
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("#3b82f6");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    const getToken = async () => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token || null;
      setUserToken(token);
    };
    getToken();
  }, []);

  useEffect(() => {
    if (userToken !== null) fetchEvents(userToken);
  }, [userToken]);

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
              const { visibility } = parseColorVisibility(event.description || "");
              return !(hidePrivate && visibility === "private");
            })
            .map((event: any) => {
              const { color, description, visibility } = parseColorVisibility(event.description || "");
              const start = new Date(event.start.dateTime || event.start.date);
              const end = new Date(event.end.dateTime || event.end.date);
              const icon = visibility === "private" ? "🔒" : "🌍";
              const cleanTitle = event.summary.replace(/^🔒 |^🌍 /, "");
              return {
                id: event.id,
                title: `${icon} ${cleanTitle}`,
                start,
                end,
                color,
                location: event.location,
                description,
              };
            })
        );
      }
    } catch (err) {
      console.error("Erreur API Calendar:", err);
      alert("Impossible de charger les événements.");
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
    setEventToEdit(event);
    setShowActionModal(true);
  };

  const resetForm = () => {
    setNewTitle("");
    setNewColor("#3b82f6");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    setVisibility("public");
    setLocation("");
    setDetails("");
    setMode("create");
    setEventToEdit(null);
  };

  const eventStyleGetter = (event: EventData) => ({
    style: {
      backgroundColor: event.color || "#3b82f6",
      borderRadius: "6px",
      color: "white",
      border: "none",
      padding: "4px",
    },
  });

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">📅 Agenda</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable={!readOnly}
        style={{ height: 900 }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        tooltipAccessor={(event) =>
          `${event.title}\n${event.start.toLocaleString()} → ${event.end.toLocaleString()}\n${event.location || ""}\n${event.description || ""}`
        }
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

      {/* Action Modal (admin only) */}
      {showActionModal && eventToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg text-center relative">
            <h3 className="text-lg font-bold mb-4">Que voulez-vous faire de cet événement ?</h3>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  setNewTitle(eventToEdit.title.replace(/^🔒 |^🌍 /, ""));
                  setStartDate(eventToEdit.start.toISOString().slice(0, 10));
                  setStartTime(eventToEdit.start.toTimeString().slice(0, 5));
                  setEndDate(eventToEdit.end.toISOString().slice(0, 10));
                  setEndTime(eventToEdit.end.toTimeString().slice(0, 5));
                  setNewColor(eventToEdit.color || "#3b82f6");
                  setLocation(eventToEdit.location || "");
                  setDetails(eventToEdit.description || "");
                  setMode("edit");
                  setShowModal(true);
                  setShowActionModal(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                ✏️ Modifier
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(true);
                  setShowActionModal(false);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                🗑️ Supprimer
              </button>
              <a
                href={generateGoogleCalendarUrl(eventToEdit)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                📥 Importer
              </a>
              <button
                onClick={() => setShowActionModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                ❌ Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
