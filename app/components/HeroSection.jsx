import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full">
      {/* Background Image */}
      <Image
        src="/montagne.jpeg" // Remplacez ceci par le chemin de votre image
        alt="Background"
        fill
        className="object-cover object-center"
        priority
      />
      
      {/* Hero Content */}
      <div className="relative h-screen flex flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider mb-8">CANI-SPORTS EURE</h1>
        <p className="max-w-3xl mx-auto text-base md:text-lg mb-12 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
        <Link
          href="/decouvrir"
          className="btn btn-primary"
        >
          Nous découvrir
        </Link>
        
      </div>
    </section>
  );
}
