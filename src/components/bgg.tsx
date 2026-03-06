// components/bgg.tsx
import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function DarkSphereGridBackground({ children, className = "" }: Props) {
  return (
    <div className={`relative z-0 min-h-screen ${className}`}>
      {/* Grid + radial glow layer */}
      <div
        className="absolute inset-0 z-[-1] pointer-events-none"
        style={{
          background: "#020617",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)
          `,
          backgroundSize: "32px 32px, 32px 32px, 100% 100%",
        }}
      />
      {/* Actual content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
