import BlueBackground from "../components/backgrounds/BlueBackground";

export default function Agenda() {
  return (
    
    <div className="p-6 space-y-4 z-1">
      {/* Composant avec taille par défaut */}
      <BlueBackground>
        <h2 className="text-xl font-bold">Encadré par défaut</h2>
        <p>Contenu standard.</p>
      </BlueBackground>

      {/* Composant avec taille personnalisée */}
      <BlueBackground width={800} height={1000} imgSize={120}>
        <h2 className="text-xl font-bold">Encadré plus grand</h2>
        <p>Contenu dans un encadré plus large et plus haut.</p>
      </BlueBackground>
    </div>


  );
}