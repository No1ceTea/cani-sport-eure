"use client";

import HeroSection from "./components/HeroSection";
import PresentationSection from "./components/PresentationSection";
import Navigation from "./components/NavigationBar"

export default function HomePage() {
  return (
    <main
      className="bg-cover bg-center"
    >
      {/* Navigation bar */}
      <Navigation />

      {/* Section Hero */}
      <HeroSection />

      {/* Section Présentation */}
      <PresentationSection />
    </main>
  );
}
