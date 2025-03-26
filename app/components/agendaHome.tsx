import React from "react";
import Calendar from "@/app/components/Calendar";

const AgendaHome = () => {
  return (
    <div className="bg-blue-900 min-h-screen p-12">
      <h2 className="text-3xl font-bold text-white mb-8">Agenda Public</h2>
      <div className="flex justify-center">
        <div className="bg-white w-full max-w-6xl rounded-[48px] shadow-lg overflow-hidden p-4 md:p-8">
          <Calendar readOnly hidePrivate />
        </div>
      </div>
    </div>
  );
};

export default AgendaHome;
