"use client";

import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

interface AddButtonAdminProps {
  onAdd?: () => void;
}

const AddButtonAdmin: React.FC<AddButtonAdminProps> = ({ onAdd }) => {
  const pathname = usePathname();

  const shouldShowButton = ["/evenements", "/articleAdmin", "/catalogue"].includes(pathname);

  if (!shouldShowButton) return null;

  const getLabel = (): string => {
    if (pathname === "/evenements") return "Ajout d’un évènement";
    if (pathname === "/articleAdmin") return "Ajout d’un article";
    if (pathname === "/catalogue") return "Ajout d’une sortie";
    return "Ajouter";
  };

  return (
    <div className="flex flex-col items-center mt-6 mb-4">
      <p className="text-white text-sm mb-2">{getLabel()}</p>
      <button
        onClick={onAdd}
        className="bg-yellow-400 hover:bg-yellow-500 text-black rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition"
        aria-label={getLabel()}
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default AddButtonAdmin;
