import Image from "next/image";
const PresentationSection = () => {
    return (
      <section
        className="py-16 px-8"
        style={{
          backgroundColor: "white",
        }}
      >
        {/* Contenu en grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Colonne gauche */}
          <div>
            {/* Titre principal */}
            <h2
              className="font-bold mb-4"
              style={{
                fontSize: "2.5rem",
                fontFamily: "opendyslexic, sans-serif",
                color: "black",
              }}
            >
              Présentation de l’association
            </h2>
            {/* Texte sous le titre principal */}
            <p
              className="mb-8"
              style={{
                fontFamily: "calibri, sans-serif",
                color: "black",
                marginBottom: "60px",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
  
            {/* Image avec encadré */}
            <div className="relative">
              {/* Encadré */}
              <div
                className="absolute -top-7 left-20 px-4 py-2 border-2 bg-darkBlue"
                style={{
                  borderColor: "black", // Contour noir
                  color: "white", // Texte blanc
                  fontFamily: "opendyslexic, sans-serif",
                  fontSize: "1.5rem", // Taille du texte
                }}
              >
                Titre de l&apos;encadré
              </div>
              {/* Image */}
              <Image
                src="/course.jpg" // Remplacez par le chemin de votre image
                alt="Présentation"
                className="w-full shadow-lg mb-8 border-2"
                style={{
                    borderRadius: "31px",
                    borderColor: "black",
                }}
                width={400}
                height={250}
              />
            </div>
  
            {/* Nos valeurs et objectifs */}
            <h3
              className="font-bold mb-4"
              style={{
                fontSize: "2rem",
                fontFamily: "opendyslexic, sans-serif",
                color: "black",
              }}
            >
              Nos valeurs et objectifs
            </h3>
            <p
              style={{
                fontFamily: "calibri, sans-serif",
                color: "black",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua.
            </p>
          </div>
  
          {/* Colonne droite : Liste des activités */}
          <div>
            <ul className="space-y-32">
              {[
                {
                  title: "Cross",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                  icon: "/cani_course2.png", // Remplacez par vos icônes
                },
                {
                  title: "Trail",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                  icon: "/cani_course.png",
                },
                {
                  title: "Marche",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                  icon: "/cani_marche.png",
                },
                {
                  title: "VTT",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                  icon: "/cani_vtt.png",
                },
                {
                  title: "Trottinette",
                  description:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                  icon: "/cani_trottinette.png",
                },
              ].map((activity, index) => (
                <li key={index} className="flex items-center">
                  <Image
                    src={activity.icon}
                    alt={activity.title}
                    className="w-40 h-15 mr-4"
                    width={200}
                    height={15}
                  />
                  <div>
                    <h4
                      className="font-bold"
                      style={{
                        fontFamily: "calibri, sans-serif",
                        color: "black",
                      }}
                    >
                      {activity.title}
                    </h4>
                    <p
                      className="text-gray-700"
                      style={{
                        fontFamily: "calibri, sans-serif",
                      }}
                    >
                      {activity.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  };
  
  export default PresentationSection;
  