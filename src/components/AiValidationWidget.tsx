/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, FileText, CheckCircle, RefreshCw, PenTool, Award, HelpCircle, Loader2, ArrowRight } from "lucide-react";
import { ValidationResponse } from "../types";

interface AiValidationWidgetProps {
  onGainXP: (amount: number) => void;
}

export default function AiValidationWidget({ onGainXP }: AiValidationWidgetProps) {
  const [text, setText] = useState("");
  const [topic, setTopic] = useState("Ma Famille");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResponse | null>(null);

  const topics = [
    { name: "Ma Famille", prompt: "Présentez brièvement les membres de votre famille et leurs professions.", helper: "Exemple: Dans ma famille, il y a mon père, ma mère et mes deux sœurs..." },
    { name: "Mon École", prompt: "Décrivez votre lycée, vos matières préférées et vos camarades de classe.", helper: "Exemple: Mon lycée s'appelle La Plume. C'est un grand établissement où j'étudie le français..." },
    { name: "Mes Vacances", prompt: "Racontez ce que vous aimez faire pendant les vacances scolaires.", helper: "Exemple: Pendant les vacances dernières, je suis allé rendre visite à mes grands-parents..." },
    { name: "Mes Projets", prompt: "Quels sont vos projets professionnels après l'école ?", helper: "Exemple: Après mes études secondaires, je voudrais aller à l'université pour étudier le droit..." }
  ];

  const handleTopicChange = (topicName: string) => {
    setTopic(topicName);
    const selectedTopic = topics.find(t => t.name === topicName);
    if (selectedTopic) {
      setText(selectedTopic.helper);
    }
  };

  const handleValidate = async () => {
    if (!text || text.trim() === "") return;
    setLoading(true);
    setResult(null);

    const currentTopicPrompt = topics.find(t => t.name === topic)?.prompt;

    try {
      const response = await fetch("/api/gemini/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: text,
          promptContext: currentTopicPrompt 
        }),
      });

      if (!response.ok) {
        throw new Error("Validation request failed");
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Expected JSON response but received non-JSON payload");
      }

      const data = await response.json();
      setResult(data);

      // Reward XP for completing an essay!
      if (data.score) {
        // High scores gain bonus XP!
        const xpGained = 100 + Math.floor(data.score / 2);
        onGainXP(xpGained);
      }
    } catch (err) {
      console.error("Validation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setResult(null);
  };

  // Determine WAEC Letter Grade equivalent
  const getWaecGrade = (score: number) => {
    if (score >= 80) return { grade: "A1 (Excellent)", color: "text-emerald-500 bg-emerald-50 border-emerald-100" };
    if (score >= 75) return { grade: "B2 (Très Bien)", color: "text-blue-500 bg-blue-50 border-blue-100" };
    if (score >= 70) return { grade: "B3 (Bien)", color: "text-indigo-500 bg-indigo-50 border-indigo-100" };
    if (score >= 65) return { grade: "C4 (Satisfaisant)", color: "text-amber-500 bg-amber-50 border-amber-100" };
    if (score >= 60) return { grade: "C5 (Passable)", color: "text-orange-500 bg-orange-50 border-orange-100" };
    if (score >= 50) return { grade: "D7 (Moyen)", color: "text-yellow-600 bg-yellow-50 border-yellow-100" };
    return { grade: "F9 (Insuffisant)", color: "text-brand-coral bg-rose-50 border-rose-100" };
  };

  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <div className="text-center mb-8">
        <span className="bg-purple-50 text-purple-600 border border-purple-100 text-xs font-mono font-bold uppercase px-3 py-1 rounded-full inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
          Correction Instantanée IA
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-extrabold text-brand-blue tracking-tight mt-2">
          AI Validation d'Essai
        </h2>
        <p className="text-slate-500 text-xs md:text-sm max-w-lg mx-auto mt-1">
          Rédigez vos essais de français selon les critères officiels de l'examen WAEC / JAMB et recevez une notation instantanée.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 md:p-8">
        {/* Topic Selector Tabs */}
        <div className="mb-6">
          <label className="text-xs font-bold uppercase text-slate-400 block mb-2 font-mono">
            Étape 1 : Choisissez un sujet d'examen
          </label>
          <div className="flex flex-wrap gap-2">
            {topics.map((t, idx) => (
              <button
                key={idx}
                onClick={() => handleTopicChange(t.name)}
                className={`px-3 py-2 text-xs md:text-sm font-semibold rounded-xl border transition-all ${
                  topic === t.name
                    ? "bg-brand-blue text-white border-brand-blue"
                    : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
          {/* Topic prompt helper text */}
          <div className="mt-3 bg-slate-50 border border-slate-100/50 p-4 rounded-2xl text-xs text-slate-500 leading-relaxed flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
            <div>
              <strong className="text-brand-blue block mb-0.5">Sujet proposé :</strong>
              {topics.find(t => t.name === topic)?.prompt}
            </div>
          </div>
        </div>

        {/* Text Input Block */}
        <div className="mb-6">
          <label className="text-xs font-bold uppercase text-slate-400 block mb-2 font-mono">
            Étape 2 : Écrivez votre texte en Français
          </label>
          <div className="relative">
            <textarea
              id="essay-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Commencez à écrire ici votre essai..."
              rows={8}
              className="w-full border-2 border-slate-100 focus:border-brand-blue focus:outline-hidden p-5 rounded-2xl font-sans text-sm md:text-base leading-relaxed text-slate-800 transition-all shadow-inner resize-y placeholder:text-slate-300"
            />
            {text && (
              <span className="absolute bottom-4 right-4 text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                {text.length} caractères
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 justify-end">
          {text && (
            <button
              onClick={handleClear}
              className="px-4 py-3 text-xs md:text-sm font-bold text-slate-500 hover:text-brand-blue hover:bg-slate-50 rounded-xl transition-all"
            >
              Effacer
            </button>
          )}
          <button
            id="btn-validate-essay"
            onClick={handleValidate}
            disabled={loading || !text.trim()}
            className={`font-bold text-xs md:text-sm px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 transform active:translate-y-0 ${
              loading || !text.trim()
                ? "bg-slate-100 text-slate-400 border border-slate-150 cursor-not-allowed"
                : "bg-brand-blue hover:bg-brand-blue-light text-white hover:-translate-y-0.5 cursor-pointer"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyse de l'IA...
              </>
            ) : (
              <>
                <PenTool className="w-4 h-4" />
                Valider ma rédaction
              </>
            )}
          </button>
        </div>

        {/* Result Block */}
        {result && (
          <div className="mt-8 border-t border-slate-100 pt-8 animate-slide-up">
            
            {/* Validation Title / Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display font-extrabold text-lg md:text-xl text-brand-blue">
                  Résultats de l'évaluation
                </h3>
                <span className="text-slate-400 text-xs">Simulé sur la grille d'évaluation du WAEC</span>
              </div>

              {/* Score Display Tag */}
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-2xl border text-center font-mono ${getWaecGrade(result.score).color}`}>
                  <span className="text-[10px] font-bold block leading-none">Grade Estimé</span>
                  <strong className="text-sm font-black tracking-tight">{getWaecGrade(result.score).grade}</strong>
                </div>

                <div className="bg-amber-50 text-amber-500 px-4 py-2 rounded-2xl border border-amber-100 font-mono text-center">
                  <span className="text-[10px] font-bold block leading-none">XP Gagnés</span>
                  <strong className="text-sm font-black tracking-tight">+{100 + Math.floor(result.score / 2)}</strong>
                </div>
              </div>
            </div>

            {/* Score Meter Bar */}
            <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>Note de Compétence Écrite :</span>
                <span>{result.score} / 100</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-brand-coral via-yellow-400 to-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>

            {/* Overall Feedback */}
            <div className="mb-6">
              <h4 className="font-display font-bold text-xs uppercase text-slate-400 tracking-wider mb-2 font-mono">
                Commentaires de l'examinateur d'IA
              </h4>
              <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-xs md:text-sm text-slate-700 leading-relaxed">
                {result.overallFeedback}
              </div>
            </div>

            {/* Specific Grammatical Corrections list */}
            {result.corrections && result.corrections.length > 0 && (
              <div className="mb-6">
                <h4 className="font-display font-bold text-xs uppercase text-slate-400 tracking-wider mb-2 font-mono">
                  Corrections de Grammaire ({result.corrections.length})
                </h4>
                <div className="space-y-3">
                  {result.corrections.map((corr, idx) => (
                    <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="line-through text-brand-coral text-xs md:text-sm font-semibold bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100/50">
                          {corr.original}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-emerald-700 text-xs md:text-sm font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                          {corr.corrected}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {corr.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Elegant Rewrite */}
            <div>
              <h4 className="font-display font-bold text-xs uppercase text-slate-400 tracking-wider mb-2 font-mono">
                La Rédaction Suggérée
              </h4>
              <div className="bg-emerald-50/20 border border-dashed border-emerald-200 p-5 rounded-2xl text-xs md:text-sm text-emerald-950 font-medium leading-relaxed italic relative">
                {result.suggestedRewrite}
                <div className="absolute top-3 right-3 bg-emerald-100/50 text-emerald-800 text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded font-bold">
                  Propre & Fluide
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
