"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { createClient } from "@supabase/supabase-js";
import * as turf from "@turf/turf";
import Image from "next/image";

// 📌 Connexion à Supabase directement dans le composant
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const MapWithStats = () => {
  const [track, setTrack] = useState(null);
  const [distance, setDistance] = useState(0);
  const [denivele, setDenivele] = useState(0);
  const [startAddress, setStartAddress] = useState("Recherche en cours...");
  const [sport, setSport] = useState("");
  const [dateTime, setDateTime] = useState(""); // 📌 Ajout du champ date et heure

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();

      if (!data.address) return "Adresse inconnue";

      const { house_number, road, postcode, city, town, village } = data.address;
      const locationCity = city || town || village || "Ville inconnue";
      const formattedAddress = `${house_number ? house_number + " " : ""}${road || "Rue inconnue"}, ${postcode || ""} ${locationCity}`;
      return formattedAddress.trim();
    } catch (error) {
      console.error("❌ Erreur de géocodage inverse :", error);
      return "Adresse non trouvée";
    }
  };

  useEffect(() => {
    const fetchTrack = async () => {
      console.log("📡 Envoi de la requête à Supabase...");

      const { data, error } = await supabase
        .rpc("get_gpx_tracks_geojson")
        .limit(1)
        .single();

      console.log("📊 Réponse Supabase :", data);
      console.log("⚠️ Erreur Supabase :", error);

      if (error) {
        console.error("❌ Erreur de récupération :", error);
        return;
      }

      if (!data || !data.geojson) {
        console.error("❌ La réponse Supabase est vide ou incorrecte !");
        return;
      }

      const coordinates = data.geojson.coordinates.map(([lon, lat, ele]) => [lat, lon, ele || 0]);
      console.log("📌 Coordonnées récupérées :", coordinates);

      let totalDistance = 0;
      for (let i = 0; i < coordinates.length - 1; i++) {
        const point1 = turf.point([coordinates[i][1], coordinates[i][0]]);
        const point2 = turf.point([coordinates[i + 1][1], coordinates[i + 1][0]]);
        let segmentDistance = turf.distance(point1, point2, { units: "meters" });
        totalDistance += segmentDistance;
      }

      console.log("🚀 Distance totale en mètres :", totalDistance);
      setDistance((totalDistance / 1000).toFixed(2));

      let totalElevationGain = 0;
      let totalElevationLoss = 0;

      for (let i = 0; i < coordinates.length - 1; i++) {
        const alt1 = coordinates[i][2];
        const alt2 = coordinates[i + 1][2];

        if (alt2 > alt1) {
          totalElevationGain += (alt2 - alt1);
        } else {
          totalElevationLoss += (alt1 - alt2);
        }
      }

      let averageGradient = totalDistance > 0 ? (totalElevationGain / totalDistance) * 100 : 0;

      console.log("🚀 Dénivelé positif (m) :", totalElevationGain);
      console.log("🚀 Dénivelé négatif (m) :", totalElevationLoss);
      console.log("🚀 Pente moyenne (%) :", averageGradient.toFixed(2));

      setDenivele(averageGradient.toFixed(2));
      setTrack({ id: data.id, name: data.name, sport: data.sport, date_time: data.date_time, coordinates });
      setDateTime(data.date_time); // 📌 Ajout de la date et heure récupérée depuis Supabase
    };

    fetchTrack();
  }, []);

  useEffect(() => {
    if (track?.coordinates?.length > 0) {
      const [lat, lon] = track.coordinates[0];
      console.log("📍 Recherche de l'adresse pour :", lat, lon);
      fetchAddress(lat, lon).then(setStartAddress);
    }
  }, [track]);

  if (!track) return <p>Chargement...</p>;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {/* 📌 Conteneur global avec bordure noire incluant la carte et le bandeau */}
      <div
        style={{
          border: "3px solid black",
          borderRadius: "10px",
          overflow: "hidden", // ✅ Évite que la bordure soit coupée
          backgroundColor: "#f8f9fa",
          width: "100%",
          maxWidth: "600px",
          position: "relative",
          textAlign: "left" // ✅ Aligne tout le contenu à gauche
        }}
      >
        {/* 📌 Carte Leaflet */}
        <MapContainer center={track.coordinates[0]} zoom={12} style={{ height: "400px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={track.coordinates.map(([lat, lon]) => [lat, lon])} color="blue" />
        </MapContainer>

        <h2 style={{ marginTop: "10px", marginLeft: "10px", fontWeight:"bold", fontSize:"24px" }}>{track.name}</h2>

        {/* 📌 Informations alignées à gauche avec icônes */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px", marginLeft: "10px" }}>
          <Image src="/download.png" alt="Télécharger GPX" width={20} height={20} />
          <button><strong>Télécharger GPX</strong></button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px", marginLeft: "10px" }}>
          <Image src="/distance.svg" alt="Distance" width={20} height={20} />
          <p><strong>Distance :</strong> {distance} km</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px", marginLeft: "10px" }}>
          <Image src="/denivele.png" alt="Dénivelé" width={20} height={20} />
          <p><strong>Dénivelé moyen :</strong> {denivele} %</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px", marginLeft: "10px" }}>
          <Image src="/puce.png" alt="Adresse" width={15} height={15} />
          <p><strong>Adresse de départ :</strong> {startAddress}</p>
        </div>

        {/* 📌 Affichage de la date et heure */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px", marginLeft: "10px" }}>
          <Image src="/calendar.png" alt="Adresse" width={15} height={15} />
          <p><strong>Date et Heure :</strong> {dateTime ? new Date(dateTime).toLocaleString() : "Non disponible"}</p>
        </div>

        {/* 📌 Bandeau Sport EN DESSOUS mais inclus dans la bordure noire */}
        <div
          style={{
            width: "100%",
            backgroundColor: "#3D9CB8",
            color: "white",
            textAlign: "center",
            padding: "10px",
            fontSize: "18px",
            fontWeight: "bold"
          }}
        >
          {track.sport || "Sport non défini"}
        </div>
      </div>
    </div>
  );
};

export default MapWithStats;
