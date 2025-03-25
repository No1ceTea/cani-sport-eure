import Calendar from "@/app/components/Calendar";
import Sidebar from "../components/sidebars/Sidebar";

export default function AgendaPage() {
  return (
    <div className="min-h-screen px-10 py-6">
        <h1 className="primary_title_blue text-4xl font-bold text-black mb-6">Évènement</h1>
      <Calendar />
      <Sidebar />
    </div>
  );
}
