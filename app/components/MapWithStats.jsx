"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";
import Image from "next/image";

const MapWithStats = ({ trackData }) => {
  const [startAddress, setStartAddress] = useState("Recherche en cours...");

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      if (!data.address) return "Adresse inconnue";

      const { house_number, road, postcode, city, town, village } = data.address;
      const locationCity = city || town || village || "Ville inconnue";
      return `${house_number ? house_number + " " : ""}${road || "Rue inconnue"}, ${
        postcode || ""
      } ${locationCity}`.trim();
    } catch (error) {
      console.error("❌ Erreur de géocodage inverse :", error);
      return "Adresse non trouvée";
    }
  };

  useEffect(() => {
    if (trackData?.geojson?.coordinates?.length > 0) {
      const [lon, lat] = trackData.geojson.coordinates[0];
      fetchAddress(lat, lon).then(setStartAddress);
    }
  }, [trackData]);

  if (!trackData) return <p>Chargement...</p>;

  const coordinates = trackData.geojson.coordinates.map(([lon, lat, ele]) => [
    lat,
    lon,
    ele || 0,
  ]);

  let totalDistance = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const point1 = turf.point([coordinates[i][1], coordinates[i][0]]);
    const point2 = turf.point([coordinates[i + 1][1], coordinates[i + 1][0]]);
    totalDistance += turf.distance(point1, point2, { units: "meters" });
  }

  let totalElevationGain = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const alt1 = coordinates[i][2];
    const alt2 = coordinates[i + 1][2];
    if (alt2 > alt1) totalElevationGain += alt2 - alt1;
  }

  const status = new Date(trackData.date_time) > new Date() ? "Ouvert" : "Fermé";

  return (
    <div
      style={{
        border: "2px solid black",
        borderRadius: "30px",
        overflow: "hidden",
        backgroundColor: "#f8f9fa",
        maxWidth: "400px",
        textAlign: "left",
        fontSize: "12px",
      }}
    >
      <div style={{ position: "relative" }}>
        <MapContainer center={coordinates[0]} zoom={12} style={{ height: "200px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={coordinates.map(([lat, lon]) => [lat, lon])} color="blue" />
        </MapContainer>

        {/* 📌 Encadré "Ouvert" / "Fermé" */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: status === "Ouvert" ? "#4EC052" : "#BB1119",
            color: "black",
            padding: "5px 10px",
            borderRadius: "30px",
            fontWeight: "bold",
            zIndex: 1000, // ✅ Pour s'afficher au-dessus de la carte
          }}
        >
          {status}
        </div>
      </div>

      <h2 style={{ margin: "10px", fontWeight: "bold", fontSize: "14px" }}>{trackData.name}</h2>

      {trackData.file_url && (
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginLeft: "10px" }}>
          <Image src="/download.png" alt="Télécharger GPX" width={18} height={18} />
          <a href={trackData.file_url} download={trackData.name} style={{ fontSize: "12px" }}>
            Télécharger GPX
          </a>
        </div>
      )}

      <div style={{ padding: "10px" }}>
        {/* ✅ Alignement des icônes et textes */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" }}>
          <Image src="/distance.svg" alt="Distance" width={18} height={18} />
          <p>
            <strong>Distance :</strong> {(totalDistance / 1000).toFixed(2)} km
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" }}>
          <Image src="/denivele.png" alt="Dénivelé" width={18} height={18} />
          <p>
            <strong>Dénivelé :</strong> {(totalElevationGain / totalDistance * 100).toFixed(2)} %
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" }}>
          <Image src="/puce.png" alt="Adresse" width={15} height={15} />
          <p>
            <strong>Adresse :</strong> {startAddress}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" }}>
          <Image src="/calendar.png" alt="Date" width={15} height={15} />
          <p>
            <strong>Date et Heure :</strong> {new Date(trackData.date_time).toLocaleString()}
          </p>
        </div>
      </div>

      <div style={{ width: "100%", backgroundColor: "#3D9CB8", color: "white", textAlign: "left", padding: "8px", fontSize: "12px", fontWeight: "bold" }}>
        {trackData.sport || "Sport non défini"}
      </div>
    </div>
  );
};

export default MapWithStats;
