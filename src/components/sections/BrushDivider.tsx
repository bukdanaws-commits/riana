"use client";

interface BrushDividerProps {
  variant?: "magenta-orange" | "gold" | "white-purple" | "purple-gold";
  className?: string;
}

/**
 * Decorative brush-stroke wave divider between sections.
 * Pure inline SVG, no external assets needed.
 */
export function BrushDivider({
  variant = "magenta-orange",
  className = "",
}: BrushDividerProps) {
  const colors = {
    "magenta-orange": {
      top: "#FC7166",
      bottom: "#FD8656",
    },
    "gold": {
      top: "#F39F23",
      bottom: "#FFB938",
    },
    "white-purple": {
      top: "#FFFFFF",
      bottom: "#884D3E",
    },
    "purple-gold": {
      top: "#181A22",
      bottom: "#F39F23",
    },
  }[variant];

  return (
    <div
      className={`relative w-full h-12 lg:h-16 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        {/* Back layer - subtle */}
        <path
          d="M 0 30 Q 150 10 300 25 T 600 25 T 900 30 T 1200 20 L 1200 60 L 0 60 Z"
          fill={colors.top}
          opacity="0.15"
        />
        {/* Mid layer - brush stroke */}
        <path
          d="M 0 35 Q 150 18 300 32 T 600 30 T 900 38 T 1200 28 L 1200 60 L 0 60 Z"
          fill={colors.bottom}
          opacity="0.55"
        />
        {/* Top layer - solid */}
        <path
          d="M 0 40 Q 150 25 300 38 T 600 36 T 900 44 T 1200 34 L 1200 60 L 0 60 Z"
          fill={colors.top}
        />
      </svg>
    </div>
  );
}
