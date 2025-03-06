import { ReactNode, useState, useEffect } from "react";
import Image from "next/image";

// Définition du type EncadreProps
interface EncadreProps {
  children: ReactNode;
  width?: number | "full"; // Largeur dynamique (full = 100vw)
  height?: number;         // Hauteur dynamique
}

const BlueBackground = ({ children, width = "full", height }: EncadreProps) => {
  // Largeur et hauteur calculées dynamiquement
  const computedWidth = width === "full" ? "100vw" : `${width}px`;
  const [computedHeight, setComputedHeight] = useState(height || "auto");

  useEffect(() => {
    if (typeof window !== "undefined" && height === undefined) {
      // Si la hauteur n'est pas définie, ajuster en fonction du contenu
      setComputedHeight("auto");
    }
  }, [height]);

  return (
    <div
      className="relative border-2 border-gray-300 bg-gray-100 p-4 rounded-lg shadow-md overflow-hidden"
      style={{
        width: computedWidth,
        height: computedHeight,
        maxWidth: "100%",
        position: "relative",
        zIndex: 1, // Assurer que le composant ne dépasse pas d'autres éléments
      }}
    >
      {/* === Fond_TL (Haut-Gauche) === */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: computedHeight,
          height: computedWidth,
          transform: "rotate(-90deg) translate(-100%, 0%)",
          transformOrigin: "top left",
          zIndex: -1, // Force l'image en arrière-plan
          position: "absolute",
        }}
      >
        <Image 
          src="/fond.png" 
          alt="Fond_TL" 
          fill 
          style={{ objectFit: "cover" }} 
        />
      </div>

      {/* === Fond_BD (Bas-Droit) === */}
      <div
        className="absolute bottom-0 right-0"
        style={{
          width: computedHeight,
          height: computedWidth,
          transform: "rotate(90deg) translate(0%, 100%)",
          transformOrigin: "bottom right",
          zIndex: -1, // Force l'image en arrière-plan
          position: "absolute",
        }}
      >
        <Image 
          src="/fond.png" 
          alt="Fond_BD" 
          fill 
          style={{ objectFit: "cover" }} 
        />
      </div>

      {/* Contenu au-dessus des images */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BlueBackground;