interface StatisticsCardProps {
  title: string;
  value: string | number;
  className?: string;
}

export default function StatisticsCard({ title, value, className = "" }: StatisticsCardProps) {
  return (
    <div className={`shadow-lg rounded-xl bg-white p-4 ${className}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
