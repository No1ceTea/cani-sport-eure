"use client";

import { useState } from "react";
import CatalogueSorties from "../components/CatalogueSorties";
import SidebarAdmin from "../components/SidebarAdmin";

export default function CataloguePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin onAdd={() => setIsModalOpen(true)} />
      <CatalogueSorties isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
}
