// src/components/mood-tracker/mood-results-screen-enhanced.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageCircle, Home, RefreshCw } from "lucide-react";
import { MoodAnswer } from "@/app/mood-tracker/page";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, PieLabelRenderProps } from "recharts";

interface MoodResultsScreenProps {
  answers: MoodAnswer[];
  onChatRedirect: () => void;
  onHomeRedirect: () => void;
  onRetake: () => void;
}

export function MoodResultsScreen({
  answers,
  onChatRedirect,
  onHomeRedirect,
  onRetake,
}: MoodResultsScreenProps) {
  // Calculate mood distribution
  const moodCounts = answers.reduce((acc, answer) => {
    acc[answer.moodType] = (acc[answer.moodType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalAnswers = answers.length;
  const moodPercentages = {
    calm: ((moodCounts.calm || 0) / totalAnswers) * 100,
    anger: ((moodCounts.anger || 0) / totalAnswers) * 100,
    happy: ((moodCounts.happy || 0) / totalAnswers) * 100,
    balanced: ((moodCounts.balanced || 0) / totalAnswers) * 100,
  };

  // Determine dominant mood
  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "balanced";

  const moodConfig = {
    calm: {
      name: "Calm",
      emoji: "😌",
      color: "#3b82f6",
      lightColor: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-700 dark:text-blue-300",
      description: "You're in a peaceful and reflective state. This tranquility helps you think clearly and find inner balance.",
      tips: [
        "Continue meditation or quiet activities",
        "Journal your thoughts",
        "Practice deep breathing exercises",
      ],
    },
    anger: {
      name: "Angry",
      emoji: "😠",
      color: "#ef4444",
      lightColor: "bg-red-100 dark:bg-red-900/30",
      textColor: "text-red-700 dark:text-red-300",
      description: "You're experiencing frustration or anger. These feelings are valid - acknowledging them is the first step to managing them.",
      tips: [
        "Try physical exercise to release tension",
        "Practice deep breathing or count to 10",
        "Talk to someone you trust about what's bothering you",
      ],
    },
    happy: {
      name: "Happy",
      emoji: "😊",
      color: "#eab308",
      lightColor: "bg-yellow-100 dark:bg-yellow-900/30",
      textColor: "text-yellow-700 dark:text-yellow-300",
      description: "You're radiating positivity and joy! This optimistic mindset helps you see opportunities and spread happiness.",
      tips: [
        "Share your joy with loved ones",
        "Practice gratitude journaling",
        "Engage in activities you love",
      ],
    },
    balanced: {
      name: "Balanced",
      emoji: "🌿",
      color: "#22c55e",
      lightColor: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-700 dark:text-green-300",
      description: "You're in a harmonious state of equilibrium. This balance allows you to handle life's ups and downs with grace.",
      tips: [
        "Maintain your healthy routines",
        "Practice mindful awareness",
        "Focus on sustainable growth",
      ],
    },
  };

  const currentMoodInfo = moodConfig[dominantMood as keyof typeof moodConfig];

  // Prepare data for charts
  const pieChartData = Object.entries(moodConfig).map(([key, config]) => ({
    name: config.name,
    value: moodCounts[key] || 0,
    color: config.color,
    emoji: config.emoji,
  })).filter(item => item.value > 0);

  const barChartData = Object.entries(moodConfig).map(([key, config]) => ({
    name: config.name,
    percentage: moodPercentages[key as keyof typeof moodPercentages],
    count: moodCounts[key] || 0,
    color: config.color,
    emoji: config.emoji,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {payload[0].payload.emoji} {payload[0].name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {payload[0].value} responses ({((payload[0].value / totalAnswers) * 100).toFixed(0)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 py-8">
      <Card className="max-w-5xl w-full shadow-2xl border-0">
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 p-8 text-center text-white rounded-t-xl">
          <div className="text-6xl mb-4">{currentMoodInfo.emoji}</div>
          <h1 className="text-3xl font-bold mb-2">Your Mood Today</h1>
          <p className="text-white/90">Based on your responses, here's your emotional landscape</p>
        </div>

        <CardContent className="p-8">
          {/* Dominant Mood */}
          <div className="text-center mb-8">
            <Badge className={`${currentMoodInfo.lightColor} ${currentMoodInfo.textColor} px-6 py-2 text-lg mb-4`}>
              Dominant Mood: {currentMoodInfo.name}
            </Badge>
            <p className="text-gray-700 dark:text-gray-300 text-base">
              {currentMoodInfo.description}
            </p>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Pie Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
                Mood Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: PieLabelRenderProps & { percent?: number }) => {
                      const { name, percent } = props;
                      return `${name} ${((percent ?? 0) * 100).toFixed(0)}%`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
                Mood Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="emoji"
                    tick={{ fill: '#6b7280', fontSize: 20 }}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    label={{ value: 'Percentage', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mood Icons Visual */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Your Mood Snapshot
            </h3>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              {Object.entries(moodConfig).map(([key, config]) => {
                const count = moodCounts[key] || 0;
                const percentage = moodPercentages[key as keyof typeof moodPercentages];
                return (
                  <div key={key} className="text-center">
                    <div
                      className={`w-24 h-24 rounded-full ${config.lightColor} flex items-center justify-center text-4xl mb-2 transition-transform hover:scale-110`}
                      style={{
                        boxShadow: count > 0 ? `0 4px 20px ${config.color}40` : 'none'
                      }}
                    >
                      {config.emoji}
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{config.name}</p>
                    <p className={`text-xs ${config.textColor} font-bold`}>
                      {percentage.toFixed(0)}% ({count})
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Personalized Tips */}
          <div className={`${currentMoodInfo.lightColor} rounded-xl p-6 mb-6`}>
            <h3 className={`font-semibold ${currentMoodInfo.textColor} mb-3 flex items-center gap-2`}>
              <span className="text-2xl">{currentMoodInfo.emoji}</span>
              Tips to Enhance Your {currentMoodInfo.name} Mood
            </h3>
            <ul className="space-y-2">
              {currentMoodInfo.tips.map((tip, index) => (
                <li key={index} className={`text-sm ${currentMoodInfo.textColor} flex items-start gap-2`}>
                  <span className="font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onChatRedirect}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-6 text-base hover:shadow-lg transition-all"
              size="lg"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Talk to AI Assistant
            </Button>
            <Button
              onClick={onRetake}
              variant="outline"
              className="flex-1 py-6 text-base"
              size="lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Retake Assessment
            </Button>
            <Button
              onClick={onHomeRedirect}
              variant="secondary"
              className="flex-1 py-6 text-base"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
            Remember: Your mood is valid, and it's okay to feel different emotions throughout the day 💙
          </p>
        </CardContent>
      </Card>
    </div>
  );
}