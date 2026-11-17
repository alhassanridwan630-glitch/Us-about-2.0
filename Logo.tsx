import { useId } from "react";

/** US&ABOUT wordmark rebuilt in SVG: script type, rose ampersand, swoosh ending in a heart. */
export function Logo({ tagline = false, className = "h-10 w-auto" }: { tagline?: boolean; className?: string }) {
  const id = useId();
  return (
    <svg viewBox={`0 0 560 ${tagline ? 210 : 170}`} className={className} role="img" aria-label="US&ABOUT">
      <defs>
        <linearGradient id={`${id}-p`} x1="0" x2="1">
          <stop offset="0" stopColor="#F5B8CE" /><stop offset="1" stopColor="#E85D91" />
        </linearGradient>
        <linearGradient id={`${id}-s`} x1="0" x2="1">
          <stop offset="0" stopColor="#E85D91" /><stop offset=".35" stopColor="#F8EDE8" /><stop offset="1" stopColor="#F8EDE8" />
        </linearGradient>
      </defs>
      <text x="10" y="112" fontSize="124" fill="#F8EDE8" style={{ fontFamily: "var(--font-script), cursive" }}>
        us<tspan fill={`url(#${id}-p)`}>&amp;</tspan>about
      </text>
      <path d="M20 150 C150 128 330 126 500 124 C520 124 528 118 530 108" fill="none" stroke={`url(#${id}-s)`} strokeWidth="3" strokeLinecap="round" />
      <path d="M530 108 C514 98 508 84 518 76 C526 70 531 78 531 82 C531 78 538 70 546 76 C556 84 546 98 530 108Z" fill="none" stroke="#F8EDE8" strokeWidth="3" strokeLinejoin="round" />
      {tagline && (
        <text x="130" y="192" fontSize="17" letterSpacing="4" fill="#E85D91" style={{ fontFamily: "var(--font-body), sans-serif" }}>
          MAKE TIME FOR WHAT MATTERS.
        </text>
      )}
    </svg>
  );
}
