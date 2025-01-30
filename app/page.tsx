"use client";

import HeroSection from "./components/HeroSection";
import PresentationSection from "./components/PresentationSection";
import NavigationBar from "./components/NavigationBar"

export default function HomePage() {
  return (
    <main
      className="bg-cover bg-center"
    >
      {/* Navigation bar */}
      <NavigationBar />

      {/* Section Hero */}
      <HeroSection />

      {/* Section Présentation */}
      <PresentationSection />
    </main>
  );
}
