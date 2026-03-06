"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "../ui/progress";

export interface Question {
  id: number;
  question: string;
  options: string[];
}

interface QuestionScreenProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: number;
  onAnswerSelect: (questionId: number, answerIndex: number) => void;
  isSubmitting?: boolean;
}

const emojiMap: Record<string, string> = {
  "Not at all": "😐",
  "Several days": "🙂",
  "More than half the days": "😕",
  "Nearly every day": "😢",
};

export function QuestionScreen({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  isSubmitting,
}: QuestionScreenProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="max-w-3xl w-full shadow-2xl border-0">
        {/* Progress bar */}
        <Progress value={progress} className="h-2 rounded-none" />

        <CardContent className="p-8">
          <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            Question {currentIndex + 1} of {totalQuestions}
          </span>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-2 mb-8">
            {question.question}
          </h2>

          {/* Options with emojis */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => onAnswerSelect(question.id, index)}
                variant="outline"
                className={`w-full text-left p-6 h-auto justify-start text-base flex items-center gap-3 ${
                  selectedAnswer === index
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 border-2"
                    : "hover:border-indigo-300"
                }`}
              >
                <span className="text-xl">
                  {emojiMap[option] || "💭"}
                </span>
                <span>{option}</span>
              </Button>
            ))}
          </div>

          {/* Loading state */}
          {isSubmitting && (
            <div className="mt-8 flex items-center justify-center gap-3 text-indigo-600 dark:text-indigo-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing your responses...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
