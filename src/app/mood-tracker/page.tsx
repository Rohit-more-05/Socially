// src/app/mood-tracker/page.tsx
"use client";

import { useState } from "react";
import { MoodWelcomeScreen } from "@/components/mood-tracker/mood-welcome-screen";
import { MoodQuestionScreen, MoodQuestion } from "@/components/mood-tracker/mood-question-screen";
import { MoodResultsScreen } from "@/components/mood-tracker/mood-results-screen-enhanced";

type Step = "welcome" | "questions" | "results";

export interface MoodAnswer {
  questionId: number;
  question: string;
  answer: string;
  moodType: "calm" | "anger" | "happy" | "balanced";
}

const MOOD_QUESTIONS: MoodQuestion[] = [
  {
    id: 1,
    question: "How would you describe your overall mood today?",
    options: [
      { text: "Peaceful and calm", mood: "calm", emoji: "😌" },
      { text: "Frustrated or irritated", mood: "anger", emoji: "😠" },
      { text: "Happy and content", mood: "happy", emoji: "😊" },
      { text: "Balanced and steady", mood: "balanced", emoji: "🌿" },
    ],
  },
  {
    id: 2,
    question: "How was your energy level throughout the day?",
    options: [
      { text: "Low and relaxed", mood: "calm", emoji: "🌙" },
      { text: "Tense and agitated", mood: "anger", emoji: "😠" },
      { text: "Positive and upbeat", mood: "happy", emoji: "☀️" },
      { text: "Stable and consistent", mood: "balanced", emoji: "⚖️" },
    ],
  },
  {
    id: 3,
    question: "How did you handle stress today?",
    options: [
      { text: "Stayed calm and composed", mood: "calm", emoji: "🧘" },
      { text: "Felt overwhelmed or angry", mood: "anger", emoji: "💢" },
      { text: "Stayed optimistic", mood: "happy", emoji: "🌈" },
      { text: "Found balance easily", mood: "balanced", emoji: "🍃" },
    ],
  },
  {
    id: 4,
    question: "How were your social interactions?",
    options: [
      { text: "Quiet and reflective", mood: "calm", emoji: "🤫" },
      { text: "Short-tempered or annoyed", mood: "anger", emoji: "😒" },
      { text: "Joyful and warm", mood: "happy", emoji: "🤗" },
      { text: "Harmonious and comfortable", mood: "balanced", emoji: "🤝" },
    ],
  },
  {
    id: 5,
    question: "What best describes your thoughts today?",
    options: [
      { text: "Peaceful and clear", mood: "calm", emoji: "💭" },
      { text: "Racing or hostile", mood: "anger", emoji: "🌪️" },
      { text: "Positive and hopeful", mood: "happy", emoji: "✨" },
      { text: "Centered and focused", mood: "balanced", emoji: "🎯" },
    ],
  },
  {
    id: 6,
    question: "How did you sleep last night?",
    options: [
      { text: "Deep and restful", mood: "calm", emoji: "😴" },
      { text: "Restless or troubled", mood: "anger", emoji: "😖" },
      { text: "Good and pleasant", mood: "happy", emoji: "🌟" },
      { text: "Normal and adequate", mood: "balanced", emoji: "💤" },
    ],
  },
  {
    id: 7,
    question: "How productive did you feel?",
    options: [
      { text: "Took it slow and steady", mood: "calm", emoji: "🐢" },
      { text: "Distracted by frustration", mood: "anger", emoji: "😾" },
      { text: "Enjoyed what I did", mood: "happy", emoji: "😄" },
      { text: "Accomplished goals calmly", mood: "balanced", emoji: "✅" },
    ],
  },
  {
    id: 8,
    question: "How did you feel physically?",
    options: [
      { text: "Relaxed and at ease", mood: "calm", emoji: "🛀" },
      { text: "Tense or on edge", mood: "anger", emoji: "😬" },
      { text: "Light and cheerful", mood: "happy", emoji: "🦋" },
      { text: "Healthy and stable", mood: "balanced", emoji: "🌱" },
    ],
  },
  {
    id: 9,
    question: "What was your main emotion today?",
    options: [
      { text: "Tranquility", mood: "calm", emoji: "🕊️" },
      { text: "Anger or resentment", mood: "anger", emoji: "😡" },
      { text: "Joy", mood: "happy", emoji: "😁" },
      { text: "Contentment", mood: "balanced", emoji: "😊" },
    ],
  },
  {
    id: 10,
    question: "How do you feel about tomorrow?",
    options: [
      { text: "Peaceful and accepting", mood: "calm", emoji: "🌊" },
      { text: "Worried or irritated", mood: "anger", emoji: "😠" },
      { text: "Optimistic and hopeful", mood: "happy", emoji: "🌅" },
      { text: "Confident and prepared", mood: "balanced", emoji: "🧭" },
    ],
  },
];

export default function MoodTrackerPage() {
  const [step, setStep] = useState<Step>("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<MoodAnswer[]>([]);

  const handleStart = () => {
    setStep("questions");
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    const question = MOOD_QUESTIONS[currentQuestion];
    const selectedOption = question.options[answerIndex];

    const newAnswer: MoodAnswer = {
      questionId,
      question: question.question,
      answer: selectedOption.text,
      moodType: selectedOption.mood,
    };

    setAnswers([...answers, newAnswer]);

    if (currentQuestion < MOOD_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        setStep("results");
      }, 300);
    }
  };

  const handleChatRedirect = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/chat";
    }
  };

  const handleHomeRedirect = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const handleRetake = () => {
    setStep("welcome");
    setCurrentQuestion(0);
    setAnswers([]);
  };

  if (step === "welcome") {
    return <MoodWelcomeScreen onStart={handleStart} />;
  }

  if (step === "questions") {
    return (
      <MoodQuestionScreen
        question={MOOD_QUESTIONS[currentQuestion]}
        currentIndex={currentQuestion}
        totalQuestions={MOOD_QUESTIONS.length}
        onAnswerSelect={handleAnswerSelect}
      />
    );
  }

  if (step === "results") {
    return (
      <MoodResultsScreen
        answers={answers}
        onChatRedirect={handleChatRedirect}
        onHomeRedirect={handleHomeRedirect}
        onRetake={handleRetake}
      />
    );
  }

  return null;
}