import Image from "next/image"

export default function Presentation() {
  return (
    <section id="presentation" className="bg-white text-black py-16 px-6 sm:px-16">
      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 container mx-auto">
        
        {/* Colonne gauche - Présentation */}
        <div className="lg:col-span-7">
          <h1 className="text-4xl font-bold mb-6">Présentation de l&apos;association</h1>

          <p className="mb-8 text-lg leading-relaxed">
            Nous sommes une association passionnée par les sports canins. Notre objectif est de promouvoir le cani-cross,
            le cani-trail, la randonnée avec chiens et d'autres disciplines adaptées aux duos humain-chien.
          </p>

          {/* Image mise en avant avec titre */}
          <div className="relative rounded-3xl overflow-hidden mb-8">
            <div className="absolute top-4 left-4 z-10">
              <h3 className="bg-blue-800 text-white px-6 py-2 rounded-lg text-xl add_border">Nos Activités</h3>
            </div>
            <Image
              src="/montagne.jpeg"
              alt="Person running with dog"
              width={600}
              height={400}
              className="w-full object-cover rounded-3xl add_border"
            />
          </div>

          <h2 className="text-2xl font-bold mb-6">Nos valeurs et objectifs</h2>
          <p className="text-lg leading-relaxed">
            Nous organisons des événements sportifs et des rencontres pour partager notre passion avec d'autres
            passionnés. Rejoignez-nous et découvrez une communauté engagée et dynamique !
          </p>
        </div>

        {/* Colonne droite - Activités */}
        <div className="lg:col-span-5 space-y-8">
          {/* Activités */}
          {[
            { title: "Cross", img: "/cani-trail.png" },
            { title: "Trail", img: "/cani-trail.png" },
            { title: "Marche", img: "/cani-marche.png" },
            { title: "VTT", img: "/cani-vtt.png" },
            { title: "Trottinette", img: "/cani-trottinette.png" }
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-24 h-24 flex-shrink-0 bg-white rounded-full flex items-center justify-center">
                <Image src={activity.img} alt={`${activity.title} icon`} width={48} height={48} className="opacity-70" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                <p className="text-lg leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}