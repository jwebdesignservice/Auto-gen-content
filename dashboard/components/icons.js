// Minimal inline stroke icons (feather-style), no dependency.
const P = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>,
  film: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M3 15h18M9 4v16M15 4v16" /></>,
  chart: <><path d="M4 20V4M4 20h16" /><rect x="7" y="12" width="3" height="5" /><rect x="12.5" y="8" width="3" height="9" /><rect x="18" y="14" width="3" height="3" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>,
  workflow: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><path d="M10 6.5h5a2 2 0 0 1 2 2V14" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  radar: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><path d="M12 12 19 7" /></>,
  spark: <path d="M12 3v6m0 6v6m-9-9h6m6 0h6M6 6l3.5 3.5M14.5 14.5 18 18M18 6l-3.5 3.5M9.5 14.5 6 18" />,
  check: <><circle cx="12" cy="12" r="9" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
  send: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />,
  star: <path d="m12 3 2.6 5.7 6.2.6-4.7 4.1 1.4 6.1L12 16.9 6.5 19.6l1.4-6.1L3.2 9.3l6.2-.6L12 3Z" />,
};

export function Icon({ name, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {P[name] || null}
    </svg>
  );
}
