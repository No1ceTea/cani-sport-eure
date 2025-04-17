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
  mode?: "admin" | "adherent" | "public";
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
  const format = (date: Date) =>
    date.toISOString().replace(/[-:]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";
  const text = `&text=${encodeURIComponent(event.title)}`;
  const dates = `&dates=${format(event.start)}/${format(event.end)}`;
  const location = event.location ? `&location=${encodeURIComponent(event.location)}` : "";
  const details = event.description ? `&details=${encodeURIComponent(event.description)}` : "";
  return `${base}${text}${dates}${location}${details}`;
}

export default function MyCalendar({ mode = "public", hidePrivate = false }: CalendarProps) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventToEdit, setEventToEdit] = useState<EventData | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const isAdmin = mode === "admin";
  const isAdherent = mode === "adherent";

  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("#3b82f6");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [modeForm, setModeForm] = useState<"create" | "edit">("create");

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
    setModeForm("create");
    setEventToEdit(null);
  };

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    if (!isAdmin) return;
    setStartDate(start.toISOString().slice(0, 10));
    setStartTime(start.toTimeString().slice(0, 5));
    setEndDate(end.toISOString().slice(0, 10));
    setEndTime(end.toTimeString().slice(0, 5));
    setShowModal(true);
  };

  const handleSelectEvent = (event: EventData) => {
    setEventToEdit(event);
    setSelectedEventId(event.id);
    setShowActionModal(true);
  };

  const handleCreateEvent = async () => {
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const fullColor = `${newColor}::${visibility}::${details}`;

    const res = await fetch("/api/calendar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(userToken && { Authorization: `Bearer ${userToken}` }),
      },
      body: JSON.stringify({
        title: newTitle,
        start,
        end,
        color: fullColor,
        location,
        description: details,
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

  const handleUpdateEvent = async () => {
    if (!eventToEdit) return;
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const fullColor = `${newColor}::${visibility}::${details}`;
    
    // 👉 1. Mise à jour sur Google Calendar
    const res = await fetch("/api/calendar", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(userToken && { Authorization: `Bearer ${userToken}` }),
      },
      body: JSON.stringify({
        id: eventToEdit.id,
        title: newTitle,
        start,
        end,
        color: fullColor,
        location,
        description: details,
      }),
    });
    
    if (!res.ok) {
      alert("Erreur lors de la mise à jour sur Google Calendar.");
      return;
    }

    
    // 👉 2. Vérifie si l’événement existe dans Supabase (via id_google)
    const { data: existingEvents, error: fetchError } = await supabase
      .from("evenements")
      .select("id")
      .eq("id_google", eventToEdit.id);
  
    if (fetchError) {
      console.error("Erreur Supabase (fetch):", fetchError);
    }
  
    if (existingEvents && existingEvents.length > 0) {
      // 👉 3. Mise à jour dans Supabase
      const { error: updateError } = await supabase
        .from("evenements")
        .update({
          titre: newTitle,
          contenu: details,
          date: startDate,
          heure_debut: startTime,
          heure_fin: endTime,
          type: visibility === "public" ? "externe" : "interne",
          
        })
        .eq("id_google", eventToEdit.id);
  
      if (updateError) {
        console.error("Erreur Supabase (update):", updateError);
        alert("Échec de la mise à jour dans la base.");
      }
    }

    // 👌 Refresh local
    fetchEvents(userToken);
    resetForm();
    setShowModal(false);
  };

  const deleteEvent = async (eventId: string) => {
    // 👉 1. Suppression dans Google Calendar
    const res = await fetch("/api/calendar", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(userToken && { Authorization: `Bearer ${userToken}` }),
      },
      body: JSON.stringify({ id: eventId }),
    });

    if (!res.ok) {
      alert("Erreur lors de la suppression de l'événement Google.");
      return;
    }


    // 👉 2. Suppression dans Supabase si `id_google` correspond
    const { data: matchedEvents, error: findError } = await supabase
      .from("evenements")
      .select("id")
      .eq("id_google", eventId);
  
    if (findError) {
      console.error("Erreur recherche Supabase :", findError);
    }
  
    if (matchedEvents && matchedEvents.length > 0) {
      const { error: deleteError } = await supabase
        .from("evenements")
        .delete()
        .eq("id_google", eventId);
  
      if (deleteError) {
        console.error("Erreur suppression Supabase :", deleteError);
        alert("Suppression partielle : l’événement a été supprimé de Google mais pas de la base.");
      }
    }
  
    // 👌 Mise à jour locale
    setEvents(events.filter((event) => event.id !== eventId));
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

  const formatEventTime = (start: Date, end: Date) => {
    const formatDate = (d: Date) =>
      d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
    const formatHour = (d: Date) =>
      d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false });
    return `${formatDate(start)} de ${formatHour(start)} à ${formatHour(end)}`;
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">📅 Agenda</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable={isAdmin}
        style={{ height: 900 }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        tooltipAccessor={(event) =>
          `${event.title}\n${formatEventTime(event.start, event.end)}\nLieu: ${event.location || "Non renseigné"}\n${event.description || ""}`
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

      {/* MODALE ACTIONS */}
      {showActionModal && eventToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg text-center">
            <h3 className="text-lg font-bold mb-4">Détail de l&apos;événement</h3>
            <p className="mb-2 font-semibold">{eventToEdit.title}</p>
            <p className="mb-2">{formatEventTime(eventToEdit.start, eventToEdit.end)}</p>
            <p className="mb-2">📍 {eventToEdit.location || "Lieu non renseigné"}</p>
            <p className="mb-4">📝 {eventToEdit.description || "Pas de description."}</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {isAdherent && (
                <a
                  href={generateGoogleCalendarUrl(eventToEdit)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Importer
                </a>
              )}
              {isAdmin && (
                <>
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
                      setVisibility(eventToEdit.title.startsWith("🔒") ? "private" : "public");
                      setModeForm("edit");
                      setShowModal(true);
                      setShowActionModal(false);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(true);
                      setShowActionModal(false);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Supprimer
                  </button>
                </>
              )}
              <button
                onClick={() => setShowActionModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODALE */}
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

      {/* FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold mb-4">
              {modeForm === "edit" ? "Modifier l'événement" : "Créer un événement"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                modeForm === "edit" ? handleUpdateEvent() : handleCreateEvent();
              }}
            >
              {/* Champs du formulaire */}
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
                Lieu :
                <input type="text" className="ml-2 border p-1 w-full" value={location} onChange={(e) => setLocation(e.target.value)} />
              </label>
              <label className="block mb-2">
                Description :
                <textarea className="ml-2 border p-1 w-full" rows={3} value={details} onChange={(e) => setDetails(e.target.value)} />
              </label>
              <label className="block mb-2">
                Couleur :
                <input type="color" className="ml-2 border p-1 w-16" value={newColor} onChange={(e) => setNewColor(e.target.value)} />
              </label>
              <label className="block mb-4">
                Visibilité :
                <select className="ml-2 border p-1" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                  <option value="public">🌍 Public</option>
                  <option value="private">🔒 Privé</option>
                </select>
              </label>
              <div className="flex gap-2 justify-center">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Enregistrer
                </button>
                <button type="button" onClick={() => { resetForm(); setShowModal(false); }} className="bg-gray-400 text-white px-4 py-2 rounded">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
