import { useNavigate } from "react-router-dom";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className = "", showText = true, size = "md" }: LogoProps) => {
  const navigate = useNavigate();
  const sizes = {
    sm: { icon: 28, text: "text-lg" },
    md: { icon: 36, text: "text-xl" },
    lg: { icon: 48, text: "text-2xl" },
  };

  const { icon, text } = sizes[size];

  return (
    <div 
      className={`flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      onClick={() => navigate('/')}
    >
      {/* Logo Icon - Abstract AI Spark */}
      <div className="relative">
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Background hexagon */}
          <path
            d="M24 4L42.5 14V34L24 44L5.5 34V14L24 4Z"
            fill="url(#logo-gradient)"
            className="drop-shadow-md"
          />
          {/* Inner sparkle/AI symbol */}
          <path
            d="M24 12L27.5 20.5L36 24L27.5 27.5L24 36L20.5 27.5L12 24L20.5 20.5L24 12Z"
            fill="white"
            fillOpacity="0.95"
          />
          {/* Small accent dots */}
          <circle cx="24" cy="24" r="2" fill="white" />
          <defs>
            <linearGradient id="logo-gradient" x1="5.5" y1="4" x2="42.5" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="hsl(227, 91%, 63%)" />
              <stop offset="1" stopColor="hsl(240, 70%, 60%)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Glow effect */}
        <div className="absolute inset-0 blur-xl opacity-40 gradient-hero rounded-full" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight text-foreground ${text}`}>
            AICG
          </span>
          <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase -mt-0.5">
            Campaign Generator
          </span>
        </div>
      )}
    </div>
  );
};
