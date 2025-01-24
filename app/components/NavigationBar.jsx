import Link from "next/link";
import Image from "next/image";

export default function NavigationBar() {
  return (
    <section>
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-10 p-4 flex justify-between items-center">
        <Link href="/" className="relative w-24 h-24">
          <Image src="/logo-noir-SansFond.png" alt="Cani-Sports Eure Logo" fill className="object-contain" />
        </Link>
        <Link href="/login" className="text-white hover:underline">
            Connexion
          </Link>
        <button className="btn btn-outline btn-primary">
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
      </nav>
    </section>
  );
}
    