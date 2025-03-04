"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const ScrollLock = () => {
  const pathname = usePathname(); // Récupère le chemin actuel
  const searchParams = useSearchParams(); // Permet de détecter les changements dans l'URL

  useEffect(() => {
    const currentPath = `${pathname}${window.location.hash}`; // Ajoute le hash à l'URL

    // Liste des pages où le scroll doit être bloqué
    const lockScrollPaths = ["/", "/#accueil"];

    if (lockScrollPaths.includes(currentPath)) {
      document.body.style.overflow = "hidden"; // Bloque le scroll
    } else {
      document.body.style.overflow = "auto"; // Autorise le scroll
    }

    return () => {
      document.body.style.overflow = "auto"; // Nettoyage
    };
  }, [pathname, searchParams]); // Re-déclenche l'effet si l'URL change

  return null;
};

export default ScrollLock;