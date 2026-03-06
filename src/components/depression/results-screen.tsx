"use client";

import { Heart, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SeverityInfo {
  level: string;
  color: string;
  bg: string;
}

interface ResultsScreenProps {
  score: number;
  maxScore: number;
  severity: SeverityInfo;
  parentEmail: string;
  onChatRedirect: () => void;
  onHomeRedirect: () => void;
}

export function ResultsScreen({
  score,
  maxScore,
  severity,
  parentEmail,
  onChatRedirect,
  onHomeRedirect,
}: ResultsScreenProps) {
  const getDescription = () => {
    if (score <= 4) return "Your responses indicate minimal signs of depression. You're doing well!";
    if (score <= 9) return "Your responses suggest mild depression symptoms. It's good to stay aware and practice self-care.";
    if (score <= 14) return "Your responses indicate moderate depression symptoms. We recommend speaking with a professional.";
    if (score <= 19) return "Your responses suggest moderately severe depression. Professional support would be beneficial.";
    return "Your responses indicate severe depression symptoms. Please seek professional help immediately.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="max-w-3xl w-full shadow-2xl border-0">
        <div className="bg-indigo-500 p-8 text-center text-white rounded-t-xl">
          <Heart className=" fill-white w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Assessment Complete</h1>
          <p className="text-white/90">Thank you for taking the time to share with us</p>
        </div>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {score}/{maxScore}
            </div>
            <Badge className={`${severity.bg} ${severity.color} px-6 py-2 text-base`}>
              {severity.level}
            </Badge>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-center text-lg">
            {getDescription()}
          </p>
          <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Report Sent</p>
            <p className="text-sm text-green-700 dark:text-green-500">
              A detailed report has been sent to your parent/guardian at{" "}
              <span className="font-semibold">{parentEmail}</span>.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onChatRedirect}
              className="flex-1 text-white bg-indigo-500  py-6 text-base"
              size="lg"
            >
              Talk to AI Assistant
            </Button>
            <Button
              onClick={onHomeRedirect}
              variant="secondary"
              className="flex-1 py-6 text-base"
              size="lg"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}