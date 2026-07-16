/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuizQuestion {
  id: string;
  paperType: "Paper 1" | "Paper 2" | "Paper 3" | "Paper 4";
  questionNumber: number;
  totalQuestions: number;
  instruction: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tipOfTheWeek: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  isCurrentUser?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface StudentProfile {
  name: string;
  level: string;
  xp: number;
  streak: number;
  badges: Badge[];
  avatarUrl: string;
}

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

export interface ValidationResponse {
  score: number;
  corrections: Correction[];
  overallFeedback: string;
  suggestedRewrite: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  translation?: string;
  vocab?: { word: string; translation: string }[];
  timestamp: string;
}
