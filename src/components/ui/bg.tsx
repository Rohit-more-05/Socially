// components/ui/VioletStormBackground.tsx
import React from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function VioletStormBackground({ children, className = "" }: Props) {
  return (
    <div className={`relative z-0 ${className}`}>
      {/* Fixed full-page background that scrolls underneath content */}
      <div
        className="fixed inset-0 z-[-1] transition-colors duration-500 bg-white dark:bg-black"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139, 92, 246, 0.2), transparent 70%)
          `,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      {/* Actual page content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
