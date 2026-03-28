interface WeatherCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function WeatherCard({ children, className = "", delay = 0 }: WeatherCardProps) {
  return (
    <div
      className={`
        rounded-2xl border border-white/10
        bg-white/8 backdrop-blur-md
        shadow-lg shadow-black/20
        animate-fade-in-up
        ${className}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
