'use client';

import { useState } from 'react';
import { FaTrash, FaEye, FaEdit } from 'react-icons/fa';

const sorties = [
  { id: 1, titre: 'Titre1', categorie: 'Cross', date: '17/04/2025', heure: '15:00', fichier: 'trajet1.gpx' },
  { id: 2, titre: 'Titre2', categorie: 'Marche', date: '25/04/2025', heure: '07:00', fichier: 'trajet1.gpx' },
  { id: 3, titre: 'Titre3', categorie: 'Trail', date: '29/04/2025', heure: '09:00', fichier: 'trajet1.gpx' },
  { id: 4, titre: 'Titre4', categorie: 'VTT', date: '30/04/2025', heure: '17:50', fichier: 'trajet1.gpx' },
];

export default function CatalogueSorties() {
  const [data, setData] = useState(sorties);

  const handleDelete = (id) => {
    setData(data.filter((sortie) => sortie.id !== id));
  };

  return (
    <div className="p-6 bg-white rounded-lg w-full mx-auto mt-8" style={{ fontFamily: 'Calibri, sans-serif' }}>
      <table className="w-full border border-gray-300 text-gray-700">
        <thead className="bg-white-100">
          <tr>
            <th className="border-t border-b p-4 text-left">Titre</th>
            <th className="border-t border-b p-4 text-left">Catégorie</th>
            <th className="border-t border-b p-4 text-left">Date</th>
            <th className="border-t border-b p-4 text-left">Heure</th>
            <th className="border-t border-b p-4 text-left">Fichier gpx</th>
            <th className="border-b p-4 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((sortie) => (
            <tr key={sortie.id} className="border-b text-md hover:bg-gray-50">
              <td className="p-4">{sortie.titre}</td>
              <td className="p-4">{sortie.categorie}</td>
              <td className="p-4">{sortie.date}</td>
              <td className="p-4">{sortie.heure}</td>
              <td className="p-4">{sortie.fichier}</td>
              <td className="p-4 flex justify-center gap-4">
                <button onClick={() => handleDelete(sortie.id)} className="text-white-300 hover:text-red-700">
                  <FaTrash />
                </button>
                <button className="text-white-300 hover:text-blue-700">
                  <FaEye />
                </button>
                <button className="text-white-300 hover:text-green-700">
                  <FaEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bouton flottant d'ajout */}
      <button className="fixed bottom-8 left-8 bg-yellow-500 text-black rounded-lg w-16 h-16 flex items-center justify-center text-3xl shadow-xl hover:bg-yellow-600">
        +
      </button>
    </div>
  );
}
