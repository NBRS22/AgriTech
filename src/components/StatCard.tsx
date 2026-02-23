interface StatCardProps {
  value: string | number;
  label: string;
  variant?: 'primary' | 'secondary';
}

export default function StatCard({ value, label, variant = 'primary' }: StatCardProps) {
  const bgClass = variant === 'primary' 
    ? 'bg-gradient-to-br from-green-500 to-green-600' 
    : 'bg-gradient-to-br from-blue-500 to-blue-600';

  return (
    <div className={`${bgClass} text-white p-4 rounded-xl text-center`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-white/90 mt-1">{label}</div>
    </div>
  );
}
