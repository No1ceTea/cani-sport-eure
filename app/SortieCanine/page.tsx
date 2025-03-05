import { Download, Mountain, MapPin, Calendar } from "lucide-react";
import MapWithStats from "../components/MapWithStats";
import GpxUploader from "../components/GpxUploader";

type TrailCardProps = {
  status: string;
  elevation: string;
  location: string;
  date: string;
  type: string;
};

const TrailCard: React.FC<TrailCardProps> = ({ status, elevation, location, date, type }) => {
  return (
    <div className="max-w-sm bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
      <MapWithStats />
      <GpxUploader />
    </div>
  );
};

export default TrailCard;
