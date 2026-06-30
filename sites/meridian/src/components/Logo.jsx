// Meridian mark: a globe with meridian lines and a glowing edge node,
// echoing the "planet-scale edge network" concept.
export default function Logo({ className = 'logo' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="meridian-grad" x1="3" y1="3" x2="29" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f2c14e" />
          <stop offset="1" stopColor="#7c5cff" />
        </linearGradient>
      </defs>
      <g stroke="url(#meridian-grad)" strokeWidth="1.4" strokeLinecap="round">
        <circle cx="16" cy="16" r="12" />
        <ellipse cx="16" cy="16" rx="4.8" ry="12" />
        <line x1="4" y1="16" x2="28" y2="16" />
        <line x1="6.5" y1="9.5" x2="25.5" y2="9.5" />
        <line x1="6.5" y1="22.5" x2="25.5" y2="22.5" />
      </g>
      <circle cx="16" cy="4" r="2.1" fill="#f2c14e" />
      <circle cx="16" cy="16" r="1.6" fill="#ffffff" />
    </svg>
  )
}
