export function ArcLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path 
        d="M 25 90 C 25 35 38 15 50 15 C 62 15 75 35 75 90" 
        stroke="url(#arc-grad)" 
        strokeWidth="24" 
        strokeLinecap="butt" 
      />
      <path 
        d="M 40 68 L 75 73 V 90 C 75 90 60 88 40 85 Z" 
        fill="#94a3b8" 
      />
      <defs>
        <linearGradient id="arc-grad" x1="50" y1="15" x2="50" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
