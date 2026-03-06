// src/components/mood-tracker/mood-welcome-screen.tsx
"use client";

import { Smile, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MoodWelcomeScreenProps {
  onStart: () => void;
}

export function MoodWelcomeScreen({ onStart }: MoodWelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-yellow-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-0">
        <div className="bg-gradient-to-r from-blue-500 via-yellow-500 to-green-500 p-8 text-white text-center rounded-t-xl">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smile className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">Mood Analyzer</CardTitle>
          <CardDescription className="text-white/90 mt-2">
            Track your daily emotions and understand your mood patterns
          </CardDescription>
        </div>

        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Welcome! Let's check in on your mood 🌈
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This quick check-in will help you reflect on your day and track your emotional patterns over time. It takes about 3 minutes.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">😌</div>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Calm</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">😠</div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">Anger</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">😊</div>
              <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">Happy</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🌿</div>
              <p className="text-sm font-semibold text-green-700 dark:text-green-300">Balanced</p>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">What you'll discover:</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li>• 10 simple questions about your day</li>
              <li>• Visual mood analysis with charts and insights</li>
              <li>• Color-coded emotional patterns</li>
              <li>• Personalized recommendations for emotional wellbeing</li>
            </ul>
          </div>
          
          <Button
            onClick={onStart}
            className="w-full text-white bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 py-6 text-lg hover:shadow-lg transition-all"
            size="lg"
          >
            Start Mood Check-In <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
            Your mood data helps you understand yourself better 💙
          </p>
        </CardContent>
      </Card>
    </div>
  );
}