import Image from "next/image";

export default function Presentation() {
  return (
    <section id="presentation" className="bg-white py-16 px-6 sm:px-16">
      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 container mx-auto">
        
        {/* Colonne gauche - Présentation */}
        <div className="lg:col-span-7">
          <h1 className="text-4xl font-bold mb-6 primary_title_black">Présentation de l&apos;association</h1>

          <p className="mb-8 text-lg leading-relaxed primary_text_black text-left">
            Nous sommes une association passionnée par les sports canins. Notre objectif est de promouvoir le cani-cross,
            le cani-trail, la marche avec chiens et d&apos;autres disciplines adaptées aux duos humain-chien.
          </p>

          {/* Image mise en avant avec titre */}
          <div className="relative rounded-3xl overflow-hidden mb-8">
            <div className="absolute top-4 left-4 z-10">
              <h3 className="bg-blue_primary primary_title px-6 py-2 rounded-lg text-xl add_border">Nos Activités</h3>
            </div>
            <Image
              src="/photos/trotinete.jpeg"
              alt="Person running with dog"
              width={600}
              height={400}
              className="w-full object-cover rounded-3xl add_border"
            />
          </div>

          <h2 className="text-2xl font-bold mb-6 primary_title_black">Nos valeurs et objectifs</h2>
          <p className="text-lg leading-relaxed primary_text_black text-left">
            Nous organisons des événements sportifs et des rencontres pour partager notre passion avec d&apos;autres
            passionnés. Rejoignez-nous et découvrez une communauté engagée et dynamique !
          </p>
        </div>

        {/* Colonne droite - Activités */}
        <div className="lg:col-span-5 space-y-8">
          {/* Activités */}
          {[
            {
              title: "Cross",
              img: "/cani-trail.png",
              description:
                "Le Canicross est un sport où le coureur et son chien forment une équipe, courant ensemble reliés par une ceinture et une ligne de trait élastique. Il favorise la complicité et l'endurance sur des distances de 5 à 9 km."
            },
            {
              title: "Trail",
              img: "/cani-trail.png",
              description:
                "Le Cani-trail est une version plus exigeante du canicross, se pratiquant sur des terrains vallonnés et techniques. Il met à l’épreuve la résistance et l'agilité du duo maître-chien."
            },
            {
              title: "Marche",
              img: "/cani-marche.png",
              description:
                "La cani-marche est une activité douce et accessible à tous. Elle permet d'explorer la nature tout en partageant un moment privilégié avec son chien, sans contrainte de vitesse."
            },
            {
              title: "VTT",
              img: "/cani-vtt.png",
              description:
                "Le Canivtt est une discipline intense où le chien, relié à un VTT par une ligne amortie, court en tête. Il exige une bonne coordination et un entraînement adapté pour garantir sécurité et plaisir."
            },
            {
              title: "Trottinette",
              img: "/cani-trottinette.png",
              description:
                "Le Cani-trottinette est une alternative ludique au canivtt, idéale pour les chiens dynamiques. Avec une trottinette tout-terrain, le chien tracte son maître sur des chemins variés."
            }
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-26 h-26 flex-shrink-0 bg-white rounded-full flex items-center justify-center">
                <Image src={activity.img} alt={`${activity.title} icon`} width={150} height={150} className="opacity-70" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                <p className="text-lg leading-relaxed">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}