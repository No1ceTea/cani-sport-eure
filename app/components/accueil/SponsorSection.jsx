import Image from "next/image";

export default function Sponsor() {
  return (
    <section id="sponsors" className="bg-white text-black py-16 px-6 sm:px-16">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6 primary_title_black">Nos sponsors</h2>

        <div className="flex justify-center items-center gap-10 flex-wrap">
          {/* Logos des sponsors */}
          {[
            { src: "/SponsorImg/carrefour.png", alt: "Carrefour" },
            { src: "/SponsorImg/bk.png", alt: "Burger King" },
            { src: "/SponsorImg/fnac.png", alt: "Fnac" },
            { src: "/SponsorImg/decathlon.png", alt: "Decathlon" }
          ].map((sponsor, index) => (
            <div key={index} className="w-40 h-24 flex justify-center">
              <Image
                src={sponsor.src}
                alt={sponsor.alt}
                width={150}
                height={100}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}