"use client";

import { useState } from "react";
import CatalogueResultats from "../components/CatalogueResultats";
import SidebarAdmin from "../components/SidebarAdmin";

export default function ResultatsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin onAdd={() => setIsModalOpen(true)} />
      <CatalogueResultats isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}
