import { ReactNode } from "react";
import Image from "next/image";

interface EncadreProps {
  children: ReactNode;
  width?: number | "full"; // Largeur dynamique
  height?: number;         // Hauteur dynamique
}

const BlueBackground = ({ children, width = "full", height = 200 }: EncadreProps) => {
  // Largeur et hauteur dynamiques de l’image
  const computedWidth = width === "full" ? "100vw" : `${width}px`;
  const computedHeight = `${height}px`;

  // Calcul dynamique des tailles pour respecter les proportions observées
  const imgWidthBD = height;  
  const imgHeightBD = width === "full" ? window.innerWidth : width;

  return (
    <div
      className="relative border-2 border-gray-300 bg-gray-100 p-4 rounded-lg shadow-md overflow-hidden"
      style={{
        width: computedWidth,
        height: computedHeight,
        maxWidth: "100%",
        overflowX: "hidden",
        zIndex: 1, // Assure que le composant ne dépasse pas la side-bar
        position: "relative",
      }}
    >
      {/* === Fond_TL (Haut-Gauche) - NE PAS TOUCHER === */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: computedHeight,
          height: imgHeightBD,
          transform: "rotate(-90deg) translate(-100%, 0%)",
          transformOrigin: "top left",
          zIndex: -1, // Force l'image en arrière-plan
        }}
      >
        <Image
          src="/fond.png"
          alt="Fond_TL"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* === Fond_BD (Bas-Droit) - Correction du rescale === */}
      <div
        className="absolute bottom-0 right-0"
        style={{
          width: imgWidthBD,  
          height: imgHeightBD,
          transform: "rotate(90deg) translate(0%, 100%)",
          transformOrigin: "bottom right",
          zIndex: -1, // Force l'image en arrière-plan
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