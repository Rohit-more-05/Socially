// src/components/PageLoader.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export function PageLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + Math.random() * 10));
    }, 800);

    const timer = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 300);
    }, 100); // Adjust this delay if needed

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <>
    {/* Top Progress Bar */}
    <div className="fixed top-0 left-0 right-0 z-[101]">
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>

    {/* Full-screen Loading Overlay */}
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  </>
  );
}   
