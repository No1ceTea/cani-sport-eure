import { Download, Mountain, MapPin, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { parseString } from "xml2js";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";

const TrailCard = ({ file }) => {
  const [gpxData, setGpxData] = useState(null);
  const [status, setStatus] = useState("Ouvert");
  const [trackPoints, setTrackPoints] = useState([]);

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      parseGPX(text);
    };
    reader.readAsText(file);
  }, [file]);

  const parseGPX = (gpxString) => {
    parseString(gpxString, (err, result) => {
      if (err) {
        console.error("Erreur lors de l'analyse du GPX", err);
        return;
      }
      setGpxData(result);
      const points = result?.gpx?.trk?.[0]?.trkseg?.[0]?.trkpt?.map((pt) => [
        parseFloat(pt.$.lat),
        parseFloat(pt.$.lon),
      ]);
      setTrackPoints(points || []);
    });
  };

  const elevation = gpxData?.gpx?.trk?.[0]?.trkseg?.[0]?.trkpt?.[0]?.ele?.[0] || "N/A";
  const location = gpxData?.gpx?.metadata?.[0]?.name?.[0] || "Non spécifié";

  return (
    <div className="max-w-sm bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
      <div className="relative w-full h-40">
        {trackPoints.length > 0 ? (
          <MapContainer center={trackPoints[0]} zoom={13} className="w-full h-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polyline positions={trackPoints} color="blue" />
          </MapContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300">
            <span>Chargement...</span>
          </div>
        )}
        <div className={`absolute top-2 right-2 text-white text-xs px-3 py-1 rounded-md ${status === "Fermé" ? "bg-red-600" : "bg-green-500"}`}>
          {status}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <Download size={16} />
          <span>Télécharger gpx</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <Mountain size={16} />
          <span>{elevation} m de dénivelé</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <MapPin size={16} />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar size={16} />
          <span>Prochaine sortie : À définir</span>
        </div>
      </div>
      <div className="bg-blue-500 text-white text-center py-3 flex items-center justify-center gap-2 cursor-pointer">
        <span className="text-lg">🚶‍♂️</span>
        <span>Cross</span>
      </div>
    </div>
  );
};

export default TrailCard;
