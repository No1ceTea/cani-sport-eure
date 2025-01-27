import Image from "next/image";
const HeroSection = () => {
  return (
    <section
      className="h-screen bg-cover bg-center relative px-8"
      style={{
        backgroundImage: "url('/montagne.jpeg')", // Chemin de votre image
      }}
    >
      {/* Logo en haut à gauche */}
      <div className="absolute top-6 left-6">
        <Image
          src="/logo-noir-SansFond.png" // Chemin de votre logo
          alt="Cani-Sports Logo"
          className="w-20 h-auto"
        />
      </div>

      {/* Contenu principal */}
      <div className="h-full flex flex-col justify-center relative">
        {/* Titre principal légèrement à gauche */}
        <h1
          className="text-white font-bold"
          style={{
            fontSize: "4rem",
            fontFamily: "opendyslexic, sans-serif",
            marginLeft: "15%", // Décalage vers la gauche
          }}
        >
          CANI-SPORTS EURE
        </h1>

        {/* Texte sous le titre, légèrement à droite */}
        <p
          className="text-white"
          style={{
            fontSize: "1rem",
            fontFamily: "calibri, sans-serif",
            maxWidth: "700px", // Limite la largeur du texte
            textAlign: "left", // Aligne le texte à gauche
            marginLeft: "50%", // Décalage vers la droite
            marginTop: "3rem", // Positionné sous le titre
            textAlign: "center"
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        </p>

        {/* Bouton en bas à droite */}
        <button
          className="absolute bottom-10 right-10 flex items-center justify-center px-12 py-3 border-2 font-bold bg-darkBlue"
          style={{
            color: "white", // Texte en blanc
            borderRadius: "50px", // Bordures arrondies
            borderColor: "black", // Contour noir
            fontFamily: "calibri, sans-serif",
            fontSize: "1.2rem", // Augmentation de la taille du texte
            minWidth: "250px", // Largeur minimale augmentée
            minHeight: "70px",
          }}
        >
          <span className="flex-grow text-center">Nous découvrir</span>
          <Image
            src="/display-password.png" // Remplacez par votre chemin d'icône
            alt="Chevron Down Icon"
            className="ml-3 w-6 h-6" // Taille de l'icône
          />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;