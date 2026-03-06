// src/components/ChatBot.tsx
"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Activity, BotIcon, Smile, PhoneCall } from "lucide-react";
import { usePathname } from "next/navigation";

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide button on certain pages
  const isHidden = pathname === "/chat" || pathname === "/depression" || pathname === "/mood-tracker";

  useEffect(() => {
    if (isHidden) setIsOpen(false);
  }, [isHidden]);

  const handleNavigation = (path: string) => {
    console.log("ChatBot: Navigating to", path);
    window.location.href = path;
    setIsOpen(false);
  };

  if (isHidden) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-500 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
        aria-label="Open mental health support"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="text-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 text-white">
                <div className="flex flex-col items-center text-center gap-3">
                  <div>
                    <h3 className="font-semibold text-xl">AnchorSpaceAI</h3>
                    <p className="text-xs text-white/80">Mental Wellness Platform</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              {/* Content - Compact Version */}
              <div className="p-4 text-center"> {/* Reduced padding from p-6 to p-4 */}
                <h4 className="font-semibold text-lg mb-0.5 text-gray-900 dark:text-gray-100">
                  How can we support you? 💙
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">
                  Select a service to begin
                </p>

                {/* Options Container - Reduced max-height to 45vh for a smaller modal footprint */}
                <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pr-1 custom-scrollbar">
                  {[
                    {
                      title: "AI Assistant",
                      desc: "Chat with our empathetic AI",
                      icon: <BotIcon className="w-5 h-5 text-white" />,
                      gradient: "from-indigo-500 to-cyan-500",
                      path: "/chat",
                    },
                    {
                      title: "Depression Tracker",
                      desc: "Quick mental wellness check",
                      icon: <Activity className="w-5 h-5 text-white" />,
                      gradient: "from-purple-500 to-red-500",
                      path: "/depression",
                    },
                    {
                      title: "Mood Analyser",
                      desc: "Track daily emotion patterns",
                      icon: <Smile className="w-5 h-5 text-white" />,
                      gradient: "from-yellow-500 to-green-500",
                      path: "/mood-tracker",
                    },
                    {
                      title: "Contact Counselor",
                      desc: "Professional human support",
                      icon: <PhoneCall className="w-5 h-5 text-white" />,
                      gradient: "from-teal-500 to-emerald-500",
                      path: "/counselor",
                    },
                  ].map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleNavigation(option.path)}
                      className={`w-full bg-gradient-to-br ${option.gradient} text-white rounded-lg p-3 transition-all duration-200 hover:scale-[1.02] text-left group relative overflow-hidden`}
                    >
                      <div className="flex items-center gap-3"> {/* Changed items-start to items-center */}
                        <div className="w-9 h-9 bg-white/20 rounded-md flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          {option.icon}
                        </div>
                        <div>
                          <h5 className="font-medium text-sm leading-none mb-1">{option.title}</h5>
                          <p className="text-[11px] text-white/80 leading-tight">{option.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </>
  );
}