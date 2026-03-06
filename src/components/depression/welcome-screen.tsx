"use client";

import { Activity, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-0">
        <div className="bg-indigo-500 p-8 text-white text-center rounded-t-xl">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-bold text-white">Depression Wellness Tracker</CardTitle>
          <CardDescription className="text-white/90 mt-2">
            A confidential assessment to understand your mental wellness
          </CardDescription>
        </div>

        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Welcome! We're here to support you 💙
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This assessment will help us understand how you've been feeling recently. It takes about 5 minutes and consists of 10 questions.
          </p>
          <div className="bg-purple-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">What to expect:</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li>• 10 questions about your recent feelings and experiences</li>
              <li>• Honest answers help us provide better support</li>
              <li>• Your results will be shared with your parent/guardian</li>
              <li>• This is not a medical diagnosis, but a wellness check-in</li>
            </ul>
          </div>
          <Button
            onClick={onStart}
            className="w-full text-white bg-indigo-500 py-6 text-lg"
            size="lg"
          >
            Get Started <ChevronRight className="w-5 h-5 " />
          </Button>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
            If you're in crisis, please contact a crisis helpline immediately
          </p>
        </CardContent>
      </Card>
    </div>
  );
}