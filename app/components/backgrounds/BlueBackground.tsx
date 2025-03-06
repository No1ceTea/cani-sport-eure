import { ReactNode, useState, useEffect } from "react";
import Image from "next/image";

// Définition du type EncadreProps
interface EncadreProps {
  children?: ReactNode;   // Permettre que le contenu soit facultatif
  width?: number | "full"; // Largeur dynamique (full = 100vw)
  height?: number;         // Hauteur dynamique
  maxSize?: boolean;       // Si true, impose la largeur et la hauteur max du parent
}

const BlueBackground = ({ children, width, height, maxSize = false }: EncadreProps) => {
  // Détection si le children est vide
  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  // Gestion des dimensions dynamiques
  const computedWidth = width ? (width === "full" ? "100vw" : `${width}px`) : maxSize ? "100%" : "auto";
  const [computedHeight, setComputedHeight] = useState(height || (maxSize || isEmpty ? "100%" : "auto"));

  useEffect(() => {
    if (typeof window !== "undefined" && height === undefined) {
      setComputedHeight(maxSize || isEmpty ? "100%" : "auto");
    }
  }, [height, maxSize, isEmpty]);

  return (
    <div
      className="relative bg-blue_primary p-4 overflow-hidden"
      style={{
        width: computedWidth,
        height: computedHeight,
        maxWidth: "100%",  // Pour éviter qu'il dépasse son conteneur
        maxHeight: "100%", // Éviter un débordement non contrôlé
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
          zIndex: -1,
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
          zIndex: -1,
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
