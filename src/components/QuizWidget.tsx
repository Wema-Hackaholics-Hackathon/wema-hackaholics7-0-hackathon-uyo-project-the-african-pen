/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Check, X, AlertCircle, Award, ArrowRight, Lightbulb, RefreshCw, Flame } from "lucide-react";
import { QuizQuestion } from "../types";
import { quizQuestions } from "../data/quizData";

interface QuizWidgetProps {
  onGainXP: (amount: number) => void;
  incrementStreak: () => void;
}

export default function QuizWidget({ onGainXP, incrementStreak }: QuizWidgetProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion: QuizQuestion = quizQuestions[currentIdx];

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
      onGainXP(50); // +50 XP per correct answer!
      incrementStreak(); // Ensure streak increments or updates!
    }
  };

  const handleNext = () => {
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-12">
      
      {/* Container Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden transition-all">
        
        {/* Card Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-red-50 text-[var(--color-brand-coral)] border border-rose-100 text-[10px] md:text-xs font-mono font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-coral)]" />
              10 SEC DÉFI
            </span>
          </div>
          <span className="text-xs md:text-sm font-bold text-slate-500 font-mono">
            {quizFinished ? "Défi Terminé" : `Question ${currentIdx + 1}/${quizQuestions.length}`}
          </span>
        </div>

        {/* Finished Quiz State */}
        {quizFinished ? (
          <div className="p-8 text-center flex flex-col items-center animate-fade-in">
            <div className="bg-amber-50 text-amber-500 p-4 rounded-full border border-amber-100 w-16 h-16 flex items-center justify-center mb-6 shadow-inner">
              <Award className="w-8 h-8" />
            </div>
            
            <h3 className="font-display text-2xl md:text-3xl font-extrabold text-[var(--color-brand-blue)] mb-2">
              Félicitations !
            </h3>
            <p className="text-slate-500 text-sm md:text-base max-w-md mb-6">
              Vous avez complété le défi de préparation au WAEC avec brio. Vos réponses démontrent votre progression.
            </p>

            {/* Score Grid */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-slate-400 text-xs font-semibold uppercase block mb-1">Score d'Examen</span>
                <span className="text-2xl font-black text-[var(--color-brand-blue)] font-mono">
                  {score} / {quizQuestions.length}
                </span>
              </div>
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 text-center">
                <span className="text-amber-600 text-xs font-semibold uppercase block mb-1">XP Gagnés</span>
                <span className="text-2xl font-black text-amber-600 font-mono flex items-center justify-center gap-1">
                  +{score * 50} <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                </span>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue-light)] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Recommencer le défi
            </button>
          </div>
        ) : (
          /* Active Quiz State */
          <div className="p-6 md:p-8 animate-fade-in">
            
            {/* Instruction */}
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-coral)] block mb-3 font-mono">
              {currentQuestion.instruction}
            </span>

            {/* Question Text */}
            <h2 className="font-display text-xl md:text-2xl font-extrabold text-slate-950 mb-8 leading-snug">
              {currentQuestion.questionText}
            </h2>

            {/* Options List */}
            <div className="space-y-3.5 mb-8">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedIdx === idx;
                const isCorrect = idx === currentQuestion.correctIndex;
                
                // Styling determination
                let btnStyle = "border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50 text-slate-800";
                let checkIcon = null;

                if (isAnswered) {
                  if (isCorrect) {
                    // Correct options highlighted in green
                    btnStyle = "border-emerald-200 bg-emerald-50/30 text-emerald-900";
                    checkIcon = <Check className="w-5 h-5 text-emerald-600 shrink-0" />;
                  } else if (isSelected) {
                    // Selected incorrect option highlighted in red
                    btnStyle = "border-rose-200 bg-rose-50/30 text-rose-900";
                    checkIcon = <X className="w-5 h-5 text-[var(--color-brand-coral)] shrink-0" />;
                  } else {
                    // Other options faded
                    btnStyle = "border-slate-50 bg-slate-50/20 text-slate-400 cursor-not-allowed";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left font-sans text-sm md:text-base font-semibold p-4.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {checkIcon}
                  </button>
                );
              })}
            </div>

            {/* Feedback / Explanation Box */}
            {isAnswered && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8 animate-slide-up">
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${selectedIdx === currentQuestion.correctIndex ? 'text-emerald-500' : 'text-[var(--color-brand-coral)]'}`} />
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-[var(--color-brand-blue)] mb-1">
                      {selectedIdx === currentQuestion.correctIndex ? "Excellent choix !" : "Réponse incorrecte"}
                    </h4>
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tip of the Week */}
            <div className="bg-amber-50 border border-amber-100/50 rounded-2xl p-5 mb-8">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold text-xs uppercase text-amber-800 tracking-wider mb-1 font-mono">
                    Tip de la semaine
                  </h4>
                  <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
                    {currentQuestion.tipOfTheWeek}
                  </p>
                </div>
              </div>
            </div>

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full bg-[var(--color-brand-blue)] hover:bg-[var(--color-brand-blue-light)] text-white font-bold text-sm px-6 py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {currentIdx === quizQuestions.length - 1 ? "Voir les résultats" : "Question suivante"}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
