interface Result {
  adhérent: string;
  competition: string;
  lieu: string;
  distance: string;
  classement: string;
  date: string;
}

interface ResultsTableProps {
  data: Result[];
}

export function ResultsTable({ data }: ResultsTableProps) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold">Résultats du club</h2>
        <table className="w-full mt-2 border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th>Adhérents</th><th>Compétition</th><th>Lieu</th><th>Distance</th><th>Classement</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-t">
                <td>{row.adhérent}</td><td>{row.competition}</td><td>{row.lieu}</td><td>{row.distance}</td><td>{row.classement}</td><td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
 