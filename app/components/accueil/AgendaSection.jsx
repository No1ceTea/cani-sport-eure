import BlueBackground from "../backgrounds/BlueBackground";

export default function Agenda() {
  return (
    <div className="p-6 space-y-6 z-1">
      {/* 1️⃣ Composant avec taille par défaut (Full Width, Hauteur auto) */}
      <BlueBackground>
        <h2 className="text-xl font-bold">Encadré par défaut</h2>
        <p>Contenu standard avec largeur automatique.</p>
      </BlueBackground>

      {/* 2️⃣ Composant avec largeur fixe et hauteur auto */}
      <BlueBackground width={600}>
        <h2 className="text-xl font-bold">Encadré largeur 600px</h2>
        <p>Hauteur ajustée au contenu.</p>
      </BlueBackground>

      {/* 3️⃣ Composant avec largeur fixe et hauteur fixe */}
      <BlueBackground width={800} height={400}>
        <h2 className="text-xl font-bold">Encadré 800x400</h2>
        <p>Contenu dans un encadré plus grand.</p>
      </BlueBackground>

      {/* 4️⃣ Composant avec une hauteur plus grande */}
      <BlueBackground width={500} height={800}>
        <h2 className="text-xl font-bold">Encadré 500x800</h2>
        <p>Hauteur plus grande pour voir l&apos;effet des images de fond.</p>
      </BlueBackground>

      {/* 5️⃣ Composant full-width avec une grande hauteur */}
      <BlueBackground width="full" height={700}>
        <h2 className="text-xl font-bold">Encadré pleine largeur (100vw) x 700px</h2>
        <p>Test de la largeur maximale.</p>
      </BlueBackground>

      {/* 6️⃣ Composant full-width, hauteur auto */}
      <BlueBackground width="full">
        <h2 className="text-xl font-bold">Encadré full width (100vw)</h2>
        <p>Hauteur définie par le contenu.</p>
      </BlueBackground>

      {/* 7️⃣ Petit encadré pour tester une petite taille */}
      <BlueBackground width={300} height={200}>
        <h2 className="text-sm font-bold">Petit encadré 300x200</h2>
        <p>Test avec une petite taille.</p>
      </BlueBackground>

      {/* 8️⃣ Test d'un très grand encadré */}
      <BlueBackground width={1000} height={1200}>
        <h2 className="text-xl font-bold">Grand encadré 1000x1200</h2>
        <p>Test avec un encadré énorme.</p>
      </BlueBackground>


      <div className="w-100 z-1" style={{height:'400px'}}>
        <BlueBackground maxSize></BlueBackground>
      </div>

      <BlueBackground>
        <h2>Encadré classique</h2>
      </BlueBackground>

      <BlueBackground width="full" height={600}>
        <h2>Encadré pleine largeur</h2>
      </BlueBackground>

      <BlueBackground width={500} height={400}>
        <h2>Encadré 500x400</h2>
      </BlueBackground>
    </div>
  );
}