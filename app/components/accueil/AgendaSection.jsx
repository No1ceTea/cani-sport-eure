import React from "react";
import Calendar from "@/app/components/Calendar";
import BlueBackground from "../backgrounds/BlueBackground";

export default function Agenda() {
  return (
    <div className="add_border">
      <BlueBackground>
        <h2 className="text-xl font-bold primary_title">Agenda Publique</h2>
        <div className="flex justify-center">
          <div className="bg-white w-full max-w-6xl rounded-[48px] shadow-lg overflow-hidden p-4 md:p-8">
            {/* 👇 readOnly et hidePrivate désactivent toutes actions + cache les privés */}
            <Calendar mode="public" hidePrivate />
            </div>
        </div>
      </BlueBackground>
    </div>
  );
}
