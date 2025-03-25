import BlueBackground from "../backgrounds/BlueBackground";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <BlueBackground>
        <div className="py-10 px-5">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-center md:text-left">
            
            {/* Colonne de gauche : Logo centré */}
            <div className="flex items-center justify-center">
              <img 
                src="/Logo-ContourBlanc-SansFond.png" 
                alt="Cani-Sports Eure" 
                className="h-40"
              />
            </div>

            {/* Colonne du centre : Navigation + Réseaux Sociaux + Copyright */}
            <div className="flex flex-col items-center">

              {/* Section Navigation */}
              <div className="grid grid-cols-3 gap-8 mb-8">
                <div>
                  <h3 className="primary_title">Informations</h3>
                  <ul className="text-sm space-y-2">
                    <li><a href="/#accueil" className="primary_text hover:underline">Le Club</a></li>
                    <li><a href="/articles" className="primary_text hover:underline">Articles</a></li>
                    <li><a href="https://sublimtout.com/200-canisports-eure" className="primary_text hover:underline">Boutique</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="primary_title">Ressources</h3>
                  <ul className="text-sm space-y-2">
                    <li><a href="/Document" className="primary_text hover:underline">Documents</a></li>
                    <li><a href="/creation-profil" className="primary_text hover:underline">Mon profil</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="primary_title">Évènements</h3>
                  <ul className="text-sm space-y-2">
                    <li><a href="/listeEvenement" className="primary_text hover:underline">Évènements</a></li>
                    <li><a href="/dashboard/client" className="primary_text hover:underline">Tableau de bord</a></li>
                  </ul>
                </div>
              </div>

              {/* Section Réseaux Sociaux - Aligner icônes et texte sur la même ligne */}
              <div className="primary_text mt-6 flex space-x-10 pb-6">
                <a href="https://instagram.com/canisports_eure" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                  <img src="/logos/instagram.svg" alt="Instagram" className="h-6" />
                  <span>@canisports_eure</span>
                </a>
                <a href="mailto:cani.sports.eure@gmail.com" className="flex items-center space-x-2">
                  <img src="/icons/email.svg" alt="Email" className="h-6" />
                  <span>cani.sports.eure@gmail.com</span>
                </a>
                <a href="https://facebook.com/canisports.eure" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                  <img src="/logos/facebook.svg" alt="Facebook" className="h-6" />
                  <span>CanisportsEure</span>
                </a>
              </div>

              {/* Barre de séparation */}
              <div className="w-full border-t border-gray-400 my-6"></div>

              {/* Copyright */}
              <p className="text-sm">© Cani Sports - Eure, Tous droits réservés</p>
            </div>

            {/* Colonne de droite (vide pour équilibrer le design) */}
            <div></div>
          </div>
        </div>
      </BlueBackground>
    </footer>
  );
}
