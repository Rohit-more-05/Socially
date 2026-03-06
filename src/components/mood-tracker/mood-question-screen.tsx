// src/components/mood-tracker/mood-question-screen.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export interface MoodOption {
  text: string;
  mood: "calm" | "anger" | "happy" | "balanced";
  emoji: string;
}

export interface MoodQuestion {
  id: number;
  question: string;
  options: MoodOption[];
}

interface MoodQuestionScreenProps {
  question: MoodQuestion;
  currentIndex: number;
  totalQuestions: number;
  onAnswerSelect: (questionId: number, answerIndex: number) => void;
}

const moodColors = {
  calm: "hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20",
  anger: "hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20",
  happy: "hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
  balanced: "hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20",
};

export function MoodQuestionScreen({
  question,
  currentIndex,
  totalQuestions,
  onAnswerSelect,
}: MoodQuestionScreenProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="max-w-3xl w-full shadow-2xl border-0">
        <Progress value={progress} className="h-2 rounded-none bg-gray-200" />

        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-2 mb-8">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => onAnswerSelect(question.id, index)}
                variant="outline"
                className={`w-full text-left p-6 h-auto justify-start text-base flex items-center gap-4 transition-all duration-200 ${
                  moodColors[option.mood]
                }`}
              >
                <span className="text-3xl">{option.emoji}</span>
                <span className="flex-1">{option.text}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}