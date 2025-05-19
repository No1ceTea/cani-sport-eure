import Image from "next/image";

export default function Sponsor() {
  return (
    <section id="sponsors" className="bg-white text-black py-16 px-6 sm:px-16">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6 primary_title_black">Nos partenaires</h2>

        <div className="flex justify-center items-center gap-10 flex-wrap">
          {/* Logos des sponsors */}
          {[
            { src: "/SponsorImg/vernon.png", alt: "Vernon" },
            { src: "/SponsorImg/normandie.png", alt: "Région Normandie" },
            { src: "/SponsorImg/assurance.png", alt: "Asuurance poitiers" },
            { src: "/SponsorImg/ffslc.jpg", alt: "FFSLC" },
            { src: "/SponsorImg/LogoEure.png", alt: "Eure" },
            { src: "/SponsorImg/LogoSNA.png", alt: "SNA" }
          ].map((sponsor, index) => (
            <div key={index} className="w-60 h-24 flex justify-center">
              <Image
                src={sponsor.src}
                alt={sponsor.alt}
                width={400}
                height={400}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}