import Calendar from "@/app/components/Calendar";
import SidebarAdmin from "../components/SidebarAdmin";

export default function AgendaPage() {
  return (
    <div className="flex overflow-hidden">
      <SidebarAdmin />
      <Calendar />
    </div>
  );
}
