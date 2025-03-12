interface Performance {
  adherent: string;
  lieu: string;
  distance: string;
  classement: string;
  date: string;
}

interface PerformanceTableProps {
  data: Performance[];
  className?: string;
}

export default function PerformanceTable({ data, className = "" }: PerformanceTableProps) {
  return (
    <div className={`shadow-lg rounded-xl bg-white p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-2">Performance par adhérent</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-2">Adhérent</th>
            <th className="p-2">Lieu</th>
            <th className="p-2">Distance</th>
            <th className="p-2">Classement</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{item.adherent}</td>
              <td className="p-2">{item.lieu}</td>
              <td className="p-2">{item.distance}</td>
              <td className="p-2">{item.classement}</td>
              <td className="p-2">{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
