// app/depression/page.tsx
"use client";

import { ContactForm, ContactInfo } from "@/components/depression/contact-form";
import { Question, QuestionScreen } from "@/components/depression/question-screen";
import { ResultsScreen } from "@/components/depression/results-screen";
import { WelcomeScreen } from "@/components/depression/welcome-screen";
import { useState } from "react";

type Step = "welcome" | "contact" | "questions" | "results";

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Over the past two weeks, how often have you felt little interest or pleasure in doing things?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 2,
    question: "How often have you felt down, depressed, or hopeless?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 3,
    question: "How often have you had trouble falling asleep, staying asleep, or sleeping too much?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 4,
    question: "How often have you felt tired or had little energy?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 5,
    question: "How often have you had poor appetite or been overeating?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 6,
    question: "How often have you felt bad about yourself or that you're a failure?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 7,
    question: "How often have you had trouble concentrating on things like reading or watching TV?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 8,
    question: "How often have you moved or spoken so slowly that others noticed? Or been so fidgety or restless?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 9,
    question: "How often have you felt isolated or withdrawn from friends and family?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    id: 10,
    question: "How often have you felt that things are overwhelming or too difficult to handle?",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
];

export default function DepressionTrackerPage() {
  const [step, setStep] = useState<Step>("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalResults, setFinalResults] = useState<{
    score: number;
    severity: { level: string; color: string; bg: string };
  } | null>(null);

  const handleStart = () => {
    setStep("contact");
  };

  const handleContactSubmit = (info: ContactInfo) => {
    setContactInfo(info);
    setStep("questions");
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex });

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setTimeout(() => {
        calculateResults();
      }, 300);
    }
  };

  const getSeverity = (score: number) => {
    if (score <= 4) return { level: "Minimal", color: "text-green-600", bg: "bg-green-100" };
    if (score <= 9) return { level: "Mild", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (score <= 14) return { level: "Moderate", color: "text-orange-600", bg: "bg-orange-100" };
    if (score <= 19) return { level: "Moderately Severe", color: "text-red-600", bg: "bg-red-100" };
    return { level: "Severe", color: "text-red-700", bg: "bg-red-200" };
  };

  const calculateResults = async () => {
    if (!contactInfo) return;
    
    setIsSubmitting(true);

    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const percentage = ((totalScore / 30) * 100).toFixed(1);
    const severity = getSeverity(totalScore);

    let description = "";
    if (totalScore <= 4) {
      description = "Your responses indicate minimal signs of depression. You're doing well!";
    } else if (totalScore <= 9) {
      description = "Your responses suggest mild depression symptoms. It's good to stay aware and practice self-care.";
    } else if (totalScore <= 14) {
      description = "Your responses indicate moderate depression symptoms. We recommend speaking with a mental health professional.";
    } else if (totalScore <= 19) {
      description = "Your responses suggest moderately severe depression. Professional support would be beneficial.";
    } else {
      description = "Your responses indicate severe depression symptoms. We strongly recommend seeking professional help immediately.";
    }

    try {
      await fetch("/api/depression-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactInfo,
          score: totalScore,
          maxScore: 30,
          percentage,
          severity: severity.level,
          description,
          answers: QUESTIONS.map((q) => ({
            question: q.question,
            answer: q.options[answers[q.id]],
          })),
        }),
      });
    } catch (error) {
      console.error("Failed to send report:", error);
    }

    setFinalResults({ score: totalScore, severity });
    setStep("results");
    setIsSubmitting(false);
  };

  const handleChatRedirect = () => {
    if (typeof window !== 'undefined') {
      window.location.href = "/chat";
    }
  };

  const handleHomeRedirect = () => {
    if (typeof window !== 'undefined') {
      window.location.href = "/";
    }
  };

  if (step === "welcome") {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (step === "contact") {
    return <ContactForm onSubmit={handleContactSubmit} />;
  }

  if (step === "questions") {
    return (
      <QuestionScreen
        question={QUESTIONS[currentQuestion]}
        currentIndex={currentQuestion}
        totalQuestions={QUESTIONS.length}
        selectedAnswer={answers[QUESTIONS[currentQuestion].id]}
        onAnswerSelect={handleAnswerSelect}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (step === "results" && finalResults && contactInfo) {
    return (
      <ResultsScreen
        score={finalResults.score}
        maxScore={30}
        severity={finalResults.severity}
        parentEmail={contactInfo.parentEmail}
        onChatRedirect={handleChatRedirect}
        onHomeRedirect={handleHomeRedirect}
      />
    );
  }

  return null;
}