import Image from "next/image";
import Link from "next/link";

const TitleSection = () => {
  return (
    <section
      className="h-screen bg-cover bg-center px-6 sm:px-16 relative grid grid-cols-5"
      style={{ backgroundImage: "url('/montagne.jpeg')" }}
    >
      {/* LOGO ET SIDEBAR */}
      <div className="col-span-5 flex justify-between items-center p-4 absolute top-0 left-0 w-full">
        {/* Logo client en haut à gauche */}
        <Image
          src="/logo-noir-SansFond.png"
          alt="Logo Client"
          width={100}
          height={50}
          className="object-contain"
        />

        {/* Bouton Sidebar en haut à droite */}
        <button className="primary_button shadow-lg">
          ☰
        </button>
      </div>

      {/* CONTENU PRINCIPAL (Titre et texte) */}
      <div className="col-span-3 flex flex-col justify-center pl-6 sm:pl-16">
        {/* Titre légèrement décalé */}
        <h1 className="text-white font-bold text-4xl sm:text-6xl font-opendyslexic drop-shadow-lg text-left">
          CANI-SPORTS EURE
        </h1>

        {/* Texte descriptif légèrement centré */}
        <p className="text-white mt-4 max-w-lg text-sm sm:text-lg font-calibri drop-shadow-md text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* ESPACE VIDE POUR AÉRATION */}
      <div className="col-span-1"></div>

      {/* BOUTON "NOUS DÉCOUVRIR" (En bas à droite) */}
      <div className="col-span-1 flex items-end justify-end pb-10 pr-10">
        <Link href="#presentation" passHref>
          <button className="primary_button flex items-center">
            <span className="mr-3">Nous découvrir</span>
            {/* Utilisation du SVG "next.svg" à la place de l'icône précédente */}
            <Image
              src="/next.svg"
              alt="NextJS Icon"
              className="w-6 h-6"
              width={24}
              height={24}
              priority
            />
          </button>
        </Link>
      </div>
    </section>
  );
};

export default TitleSection;