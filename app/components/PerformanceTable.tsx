
  interface PerformanceData {
    adhérent: string;
    lieu: string;
    distance: string;
    classement: string;
    date: string;
  }

  interface PerformanceTableProps {
    data: PerformanceData[];
  }

  export function PerformanceTable({ data }: PerformanceTableProps) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold">Performance par adhérent</h2>
        <table className="w-full mt-2 border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th>Adhérent</th><th>Lieu</th><th>Distance</th><th>Classement</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-t">
                <td>{row.adhérent}</td><td>{row.lieu}</td><td>{row.distance}</td><td>{row.classement}</td><td>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  