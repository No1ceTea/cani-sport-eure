import BlueBackground from "../backgrounds/BlueBackground";

export default function Agenda() {
  return (

    <div className="add_border">
    <BlueBackground>
      <h2 className="text-xl font-bold primary_title">Agenda Publique</h2>
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800">Agenda Publique</h2>
      <ul className="mt-4 space-y-3">
        <li className="p-3 bg-gray-100 rounded-lg flex justify-between">
          <span className="font-medium">Événement 1</span>
          <span className="text-sm text-gray-500">06/04/2025</span>
        </li>
        <li className="p-3 bg-gray-100 rounded-lg flex justify-between">
          <span className="font-medium">Événement 2</span>
          <span className="text-sm text-gray-500">12/09/2025</span>
        </li>
      </ul>
      <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
        Voir Plus
      </button>
    </div>
    </BlueBackground>
    </div>
    
  );
}