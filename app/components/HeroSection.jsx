import Image from "next/image";

const HeroSection = () => {
  return (
    <section
      className="h-screen bg-cover bg-center relative px-4 sm:px-8 flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/montagne.jpeg')", // Chemin de votre image
      }}
    >
      {/* Logo en haut à gauche */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Image
          src="/logo-noir-SansFond.png" // Chemin de votre logo
          alt="Cani-Sports Logo"
          className="w-16 sm:w-20 h-auto"
          width={200}
          height={200}
        />
      </div>

      {/* Contenu principal */}
      <div className="w-full flex flex-col items-center text-center px-4">
        {/* Titre principal */}
        <h1
          className="text-white font-bold"
          style={{
            fontSize: "2rem", // Taille réduite sur mobile
            fontFamily: "opendyslexic, sans-serif",
          }}
        >
          CANI-SPORTS EURE
        </h1>

        {/* Texte sous le titre */}
        <p
          className="text-white mt-4 max-w-lg sm:max-w-2xl"
          style={{
            fontSize: "0.9rem", // Taille plus petite sur mobile
            fontFamily: "calibri, sans-serif",
            textAlign: "center",
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        {/* Bouton en bas */}
        <button
          className="btn btn-primary flex items-center justify-center mt-8 px-8 py-3 border-2 font-bold"
          style={{
            color: "white",
            borderRadius: "50px",
            fontFamily: "calibri, sans-serif",
            fontSize: "1rem",
            minWidth: "200px", // Réduction pour mobile
            minHeight: "60px",
          }}
        >
          <span className="flex-grow text-center">Nous découvrir</span>
          <Image
            src="/display-password.png"
            alt="Chevron Down Icon"
            className="ml-3 w-5 h-5 sm:w-6 sm:h-6 text-white" // Taille ajustée
            width={50}
            height={50}
          />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
