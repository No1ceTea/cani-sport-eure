
interface StatisticsCardProps {
    title: string;
    value: string | number;
  }

  export function StatisticsCard({ title, value }: StatisticsCardProps) {
    return (
      <div className="bg-white p-4 rounded-lg shadow text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value} %</p>
      </div>
    );
  }
  