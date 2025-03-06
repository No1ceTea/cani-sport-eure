import { ReactNode } from "react";
import Image from "next/image";

// Définition du type EncadreProps
interface EncadreProps {
  children?: ReactNode;
  width?: number | "full"; // Largeur dynamique (full = 100vw)
  height?: number;         // Hauteur dynamique
  maxSize?: boolean;       // Forcer largeur/hauteur maximales
}

const BlueBackground = ({ children, width, height, maxSize = false }: EncadreProps) => {
  // Gestion des dimensions
  const computedWidth = width ? (width === "full" ? "100vw" : `${width}px`) : maxSize ? "100%" : "auto";
  const computedHeight = height ? `${height}px` : maxSize ? "100%" : "auto";

  return (
    <div
      className="relative overflow-hidden bg-blue_primary p-4"
      style={{
        width: computedWidth,
        height: computedHeight,
        maxWidth: "100%", 
        maxHeight: "100%",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* === Fond_TL (Haut-Gauche) === */}
      <div
        className="absolute top-0 left-0"
        style={{
          width: "100%",
          height: "100%",
          zIndex: -1,
          position: "absolute",
        }}
      >
        <Image 
          src="/fond.png" 
          alt="Fond_TL" 
          layout="fill"
          objectFit="cover"
          style={{ opacity: 0.8 }} // Ajuster l'opacité si besoin
        />
      </div>

      {/* === Fond_BD (Bas-Droit) === */}
      <div
        className="absolute bottom-0 right-0"
        style={{
          width: "100%",
          height: "100%",
          zIndex: -1,
          position: "absolute",
        }}
      >
        <Image 
          src="/fond.png" 
          alt="Fond_BD" 
          layout="fill"
          objectFit="cover"
          style={{ opacity: 0.8, transform: "rotate(180deg)" }} // Rotation pour bien s'adapter
        />
      </div>

      {/* Contenu au-dessus des images */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BlueBackground;
