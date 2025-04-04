"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar w-full items-center justify-between p-4 ">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/logo-noir-SansFond.png"
          alt="Cani-Sports Logo"
          width={50}
          height={50}
          className="w-12 h-auto"
        />
      </Link>
      
      {/* Bouton Menu */}
      <button className="btn btn-outline btn-primary" onClick={toggleMenu}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      
      {/* Menu latéral */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-500 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMenu}
      >
        <div
          className={`fixed top-0 right-0 w-64 h-full bg-blue-900 text-white p-6 z-50 transform transition-transform duration-500 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Bouton fermer */}
          <button
            className="absolute top-4 right-4 text-xl"
            onClick={toggleMenu}
          >
            ✕
          </button>
          
          {/* Liens du menu */}
          <nav className="flex flex-col space-y-4 mt-8">
            <a href="#le-club" className="text-lg hover:underline">
              Le Club
            </a>
            <a href="#actualites" className="text-lg hover:underline">
              Actualités
            </a>
            <a href="#evenements" className="text-lg hover:underline">
              Événements
            </a>
            <a href="#articles" className="text-lg hover:underline">
              Articles
            </a>

            <Link href="/creation-chien" className="text-lg hover:underline">
              chien test
            </Link>
            <Link href="/connexion" className="text-lg hover:underline">
              Se connecter
            </Link>
            <Link href="/evenements" className="text-lg hover:underline">
              Events
            </Link>
            <Link href="/articles" className="text-lg hover:underline">
              Articles
            </Link>
            <Link href="/tableauAdmin" className="text-lg hover:underline">
              tableau
            </Link>
            <Link href="/Agenda" className="text-lg hover:underline">
              CALENDRIER
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  );
}
