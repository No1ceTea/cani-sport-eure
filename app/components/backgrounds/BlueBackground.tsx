import { ReactNode } from "react";
import Image from "next/image";

interface EncadreProps {
  children: ReactNode;
  width?: number | "full"; // Largeur dynamique
  height?: number;         // Hauteur dynamique
}

const BlueBackground = ({ children, width = "full", height = 200 }: EncadreProps) => {
  // Largeur et hauteur dynamiques de l’image
  const computedWidth = width === "full" ? window.innerWidth : width;
  const computedHeight = height;

  // Calcul dynamique des tailles pour respecter les proportions observées
  const imgWidthBD = computedHeight;  // Largeur de Fond_BD = hauteur de l'encadré
  const imgHeightBD = computedWidth;  // Hauteur de Fond_BD = largeur de l'encadré

  return (
    <div
      className="relative border-2 border-gray-300 bg-gray-100 p-4 rounded-lg shadow-md overflow-hidden"
      style={{ width: computedWidth, height: computedHeight }}
    >
      {/* === Fond_TL (Haut-Gauche) - NE PAS TOUCHER === */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: `${computedHeight}px`,
          height: `${computedWidth}px`,
          transform: "rotate(-90deg) translate(-100%, 0%)",
          transformOrigin: "top left",
        }}
      >
        <Image
          src="/fond.png"
          alt="Fond_TL"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* === Fond_BD (Bas-Droit) - Correction de l’ancrage === */}
      <div
        className="absolute bottom-0 right-0"
        style={{
          width: `${imgWidthBD}px`,  // Fond_BD suit les dimensions comme dans les exemples
          height: `${imgHeightBD}px`,
          transform: "rotate(90deg) translate(0%, 100%)", // Ajustement clé
          transformOrigin: "bottom right"
        }}
      >
        <Image
          src="/fond.png"
          alt="Fond_BD"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Contenu au-dessus */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BlueBackground;
