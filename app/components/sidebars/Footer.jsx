import BlueBackground from "../backgrounds/BlueBackground";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <BlueBackground>
        <div className="py-10 px-5">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-center md:text-left">
            
            {/* Colonne de gauche */}
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
                    <li><a href="#" className="primary_text hover:underline">Le club</a></li>
                    <li><a href="#" className="primary_text hover:underline">Articles</a></li>
                    <li><a href="#" className="primary_text hover:underline">Boutique</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="primary_title">Ressources</h3>
                  <ul className="text-sm space-y-2">
                    <li><a href="#" className="primary_text hover:underline">Actualités</a></li>
                    <li><a href="#" className="primary_text hover:underline">Documents</a></li>
                    <li><a href="#" className="primary_text hover:underline">Mon profil</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="primary_title">Évènements</h3>
                  <ul className="text-sm space-y-2">
                    <li><a href="#" className="primary_text hover:underline">Évènements</a></li>
                    <li><a href="#" className="primary_text hover:underline">Tableau de bord</a></li>
                  </ul>
                </div>
              </div>

              {/* Section Réseaux Sociaux */}
              <div className="primary_text mt-6 flex space-x-6 pb-6">
                <a href="https://instagram.com/canisports_eure" target="_blank" rel="noopener noreferrer">
                  <img src="/logos/instagram.svg" alt="Instagram" className="h-6" />
                  @CS27
                </a>
                <a href="mailto:cani.sports.eure@gmail.com">
                  <img src="/icons/email.svg" alt="Email" className="h-6" />
                  cs27@gmail.com
                </a>
                <a href="https://facebook.com/canisports.eure" target="_blank" rel="noopener noreferrer">
                  <img src="/logos/facebook.svg" alt="Facebook" className="h-6" />
                  /CS-27
                </a>
              </div>

              {/* Barre de séparation */}
              <div className="w-full border-t border-gray-400 my-6"></div>

              {/* Copyright */}
              <p className="text-sm">© Cani Sports - Eure, Tous droits réservés</p>
            </div>

            {/* Colonne de droite */}
            <div></div>
          </div>
        </div>
      </BlueBackground>
    </footer>
  );
}