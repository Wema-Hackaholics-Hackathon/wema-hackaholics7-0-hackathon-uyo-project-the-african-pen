import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Check, 
  Clock, 
  Award, 
  Calendar, 
  Sparkles, 
  Copy, 
  History, 
  ChevronRight, 
  FileText, 
  BookOpen, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from "lucide-react";

interface LaLettreProps {
  userXP: number;
  userStreak: number;
  setCurrentView: (view: string) => void;
  onGainXP: (amount: number) => void;
  isPremium: boolean;
  userFullName: string;
}

interface LetterCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

interface ValidationResult {
  score: number;
  criteriaScores: {
    structure: number;
    grammar: number;
    vocab: number;
    coherence: number;
  };
  corrections: LetterCorrection[];
  feedback: string;
  strengths: string;
  improvements: string;
  suggestedRewrite: string;
}

export default function LaLettre({ 
  userXP, 
  userStreak, 
  setCurrentView, 
  onGainXP, 
  isPremium, 
  userFullName 
}: LaLettreProps) {
  const [editorText, setEditorText] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [submissionHistory, setSubmissionHistory] = useState<Array<{ date: string; score: number }>>([]);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Load draft & history from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("la_lettre_draft");
    if (savedDraft) {
      setEditorText(savedDraft);
      calculateWordCount(savedDraft);
    }

    const savedHistory = localStorage.getItem("la_lettre_history");
    if (savedHistory) {
      try {
        setSubmissionHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const calculateWordCount = (text: string) => {
    const trimmed = text.trim();
    const count = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
    setWordCount(count);
  };

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setEditorText(text);
    calculateWordCount(text);
    setIsSaved(false);

    // Auto-save debounced or instant
    localStorage.setItem("la_lettre_draft", text);
    
    // Simulate auto-save feedback
    const timer = setTimeout(() => {
      setIsSaved(true);
    }, 800);
    return () => clearTimeout(timer);
  };

  const copyToolboxPhrase = (phrase: string, index: number) => {
    navigator.clipboard.writeText(phrase);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);

    // Insert at current cursor position or append to editor
    if (editorRef.current) {
      const textarea = editorRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = editorText.substring(0, start) + phrase + editorText.substring(end);
      setEditorText(newText);
      calculateWordCount(newText);
      localStorage.setItem("la_lettre_draft", newText);
      textarea.focus();
    } else {
      const newText = editorText + (editorText ? "\n\n" : "") + phrase;
      setEditorText(newText);
      calculateWordCount(newText);
      localStorage.setItem("la_lettre_draft", newText);
    }
  };

  const copySuggestedRewrite = () => {
    if (validationResult?.suggestedRewrite) {
      navigator.clipboard.writeText(validationResult.suggestedRewrite);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handleSubmitProject = async () => {
    if (wordCount < 100) return; // Allow submission with slightly shorter for flexibility but warning in UI

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setShowResults(false);

    // Progress animation
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    try {
      const response = await fetch("/api/gemini/validate-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: editorText }),
      });

      const result: ValidationResult = await response.json();
      clearInterval(interval);
      setAnalysisProgress(100);

      // Save to history
      const newHistoryItem = {
        date: new Date().toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        score: result.score,
      };

      const updatedHistory = [newHistoryItem, ...submissionHistory];
      setSubmissionHistory(updatedHistory);
      localStorage.setItem("la_lettre_history", JSON.stringify(updatedHistory));

      // Award XP
      if (result.score >= 10) {
        onGainXP(300);
      }

      setValidationResult(result);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
      }, 500);

    } catch (error) {
      console.error("Submission failed", error);
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };

  // Helper styles for word counts
  const getWordCountColor = () => {
    if (wordCount < 150) return "text-rose-500";
    if (wordCount < 250) return "text-amber-500";
    return "text-emerald-500";
  };

  const getWordStatusBg = () => {
    if (wordCount < 150) return "bg-rose-500";
    if (wordCount < 250) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const toolboxPhrases = [
    {
      category: "OUVERTURE / CONVENANCE",
      text: "Je me permets de vous adresser ma candidature afin d'intégrer..."
    },
    {
      category: "ARGUMENTATION / MOTIVATION",
      text: "Ma motivation est d'autant plus vive que votre faculté est réputée..."
    },
    {
      category: "SALUTATIONS FORMELLES",
      text: "Dans l'attente d'une réponse favorable, je vous prie d'agréer..."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#fcfcfd] text-slate-800 pb-16 font-sans">
      
      {/* Decorative Top French Colors Ribbon */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-700 via-white to-red-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Breadcrumbs Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setCurrentView("parcours")}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#002B5B] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Retour au Parcours
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-400">XP Actuel : {userXP}</span>
            {isPremium && (
              <span className="text-[10px] bg-amber-100 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-black uppercase">
                Premium ⭐
              </span>
            )}
          </div>
        </div>

        {/* Title & Stats Grid Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-100 text-amber-700 rounded-full">
              <span className="text-xs">✉️</span>
              <span className="font-mono text-[10px] font-black uppercase tracking-wider">
                PROJET DE LA SEMAINE 1
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#002B5B] tracking-tight">
              La Lettre de Motivation
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Sujet d'entraînement officiel pour la préparation aux examens de Français.
            </p>
          </div>

          {/* Project Stats Dashboard */}
          <div className="grid grid-cols-3 gap-4 border border-slate-100 bg-slate-50/50 p-4 rounded-2xl md:w-96 text-center">
            <div className="space-y-1">
              <div className="flex justify-center"><Clock className="w-4 h-4 text-slate-400" /></div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">DURÉE</span>
              <span className="text-xs font-black text-slate-700">45 Min</span>
            </div>
            <div className="space-y-1 border-x border-slate-200">
              <div className="flex justify-center"><Award className="w-4 h-4 text-amber-500" /></div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">RÉCOMPENSE</span>
              <span className="text-xs font-black text-emerald-600">+300 XP</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-center"><Calendar className="w-4 h-4 text-rose-500" /></div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">ÉCHÉANCE</span>
              <span className="text-xs font-black text-slate-700">Dim. 23:59</span>
            </div>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Context, Editor & Submission (7 or 8 cols depending on view) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Context Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-black text-base text-slate-800">Mise en situation réelle</h2>
                  <p className="text-[11px] text-slate-400 font-semibold">Exercice officiel - Université Cheikh Anta Diop</p>
                </div>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                Vous êtes un étudiant nigérian et vous souhaitez postuler pour une licence en <strong className="text-slate-800">Lettres Modernes</strong> à l'Université Cheikh Anta Diop (UCAD) de Dakar. Rédigez une lettre de motivation formelle en respectant scrupuleusement les conventions épistolaires françaises.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-full text-[10px] font-bold font-mono uppercase">
                  Registre : Formel
                </span>
                <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-full text-[10px] font-bold font-mono uppercase">
                  Destinataire : Recteur de l'UCAD
                </span>
                <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-full text-[10px] font-bold font-mono uppercase">
                  Objet : Demande d'admission
                </span>
              </div>
            </div>

            {/* Structure Flow bar indicator */}
            <div className="bg-[#002B5B] text-slate-200 p-4 rounded-2xl flex items-center justify-between text-center overflow-x-auto whitespace-nowrap gap-4 scrollbar-thin">
              <div className="flex items-center gap-2 shrink-0 text-xs font-extrabold text-blue-300">
                <span className="w-5 h-5 rounded-full bg-blue-900/50 flex items-center justify-center text-[10px]">1</span>
                Lieu &amp; Date
              </div>
              <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
              <div className="flex items-center gap-2 shrink-0 text-xs font-extrabold">
                <span className="w-5 h-5 rounded-full bg-blue-900/50 flex items-center justify-center text-[10px]">2</span>
                Objet précis
              </div>
              <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
              <div className="flex items-center gap-2 shrink-0 text-xs font-extrabold">
                <span className="w-5 h-5 rounded-full bg-blue-900/50 flex items-center justify-center text-[10px]">3</span>
                Formule d'appel
              </div>
              <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
              <div className="flex items-center gap-2 shrink-0 text-xs font-extrabold">
                <span className="w-5 h-5 rounded-full bg-blue-900/50 flex items-center justify-center text-[10px]">4</span>
                Corps de lettre
              </div>
              <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
              <div className="flex items-center gap-2 shrink-0 text-xs font-extrabold">
                <span className="w-5 h-5 rounded-full bg-blue-900/50 flex items-center justify-center text-[10px]">5</span>
                Salutations distinguées
              </div>
            </div>

            {/* Editor Area Card */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold font-mono uppercase">
                  <FileText className="w-4 h-4 text-slate-400" />
                  Rédacteur Interactif
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold font-mono uppercase">
                    <span className={`w-2 h-2 rounded-full ${getWordStatusBg()}`}></span>
                    <span className={getWordCountColor()}>{wordCount}</span> / 300 mots minimum
                  </span>
                </div>
              </div>

              {/* Textarea */}
              <textarea
                ref={editorRef}
                value={editorText}
                onChange={handleEditorChange}
                placeholder="Exemple de début :&#10;Lagos, le 15 juin 2026&#10;&#10;À l'attention de Monsieur le Recteur de l'Université Cheikh Anta Diop (UCAD)&#10;Dakar, Sénégal&#10;&#10;Objet : Demande d'admission en Licence de Lettres Modernes...&#10;&#10;Monsieur le Recteur,&#10;&#10;C'est avec un profond respect que je sollicite..."
                className="w-full h-[450px] p-6 sm:p-8 text-sm sm:text-base text-slate-700 bg-transparent border-0 focus:ring-0 resize-none font-serif leading-relaxed placeholder-slate-400 focus:outline-hidden"
              ></textarea>

              {/* Action footer */}
              <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">
                    {isSaved ? "Sauvegardé localement" : "Écriture en cours..."}
                  </span>
                </div>

                <button
                  onClick={handleSubmitProject}
                  disabled={wordCount < 100 || isAnalyzing}
                  className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-all ${
                    wordCount < 100 || isAnalyzing
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
                      : "bg-[#002B5B] text-white hover:bg-[#001736] hover:scale-[1.02] active:scale-95 cursor-pointer"
                  }`}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Analyse en cours...
                    </span>
                  ) : (
                    "Soumettre pour correction IA ✨"
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Rubric, Toolbox, and History (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Grille Evaluation Rubric */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                Barème d'Évaluation
              </h3>
              <div className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>1. Conventions &amp; Structure</span>
                    <span className="text-[#002B5B] font-mono">/ 4 pts</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-1/4"></div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Lieu, date, en-têtes, objet, appel, formule finale.</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>2. Grammaire &amp; Orthographe</span>
                    <span className="text-[#002B5B] font-mono">/ 6 pts</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-1/3"></div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Accords complexes, conjugaisons au subjonctif/conditionnel.</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>3. Vocabulaire &amp; Registre</span>
                    <span className="text-[#002B5B] font-mono">/ 6 pts</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-1/2"></div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Style soutenu, lexique académique d'excellence.</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>4. Cohérence &amp; Force</span>
                    <span className="text-[#002B5B] font-mono">/ 4 pts</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-1/4"></div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Clarté de la motivation d'étude et projet universitaire.</p>
                </div>
              </div>
            </div>

            {/* Toolbox Cards */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                Boîte à outils d'Élite
              </h3>
              <p className="text-slate-400 text-[11px] font-medium leading-relaxed">
                Cliquez pour copier et intégrer ces phrases modèles recommandées par les correcteurs :
              </p>
              
              <div className="space-y-3 pt-1">
                {toolboxPhrases.map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => copyToolboxPhrase(phrase.text, idx)}
                    className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-300 transition-all cursor-pointer group flex justify-between items-start gap-2 text-xs"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-black text-blue-600 tracking-wider block uppercase">
                        {phrase.category}
                      </span>
                      <span className="text-slate-600 leading-normal font-medium italic block">
                        « {phrase.text} »
                      </span>
                    </div>
                    <div className="p-1 rounded-lg bg-white border border-slate-100 shrink-0">
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submission History */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                  Historique des envois
                </h3>
              </div>

              {submissionHistory.length === 0 ? (
                <div className="border border-dashed border-slate-200 p-4 rounded-2xl text-center">
                  <p className="text-[11px] text-slate-400 font-medium italic">
                    Aucune tentative enregistrée pour le moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {submissionHistory.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">ENVOYÉ LE</span>
                        <span className="text-slate-600">{item.date}</span>
                      </div>
                      <span className={`font-mono px-2 py-0.5 rounded-lg text-xs font-black ${
                        item.score >= 14 ? "bg-emerald-50 border border-emerald-200 text-emerald-700" :
                        item.score >= 10 ? "bg-amber-50 border border-amber-200 text-amber-700" :
                        "bg-rose-50 border border-rose-200 text-rose-700"
                      }`}>
                        {item.score}/20
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* AI ANALYSIS FULL SCREEN MODAL */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-[#001736]/95 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md">
          <div className="max-w-md w-full space-y-6">
            <div className="relative flex justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-blue-900 border-t-amber-400 animate-spin flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display font-black text-2xl text-white">Analyse IA en cours...</h2>
              <p className="text-blue-200 text-xs sm:text-sm font-semibold max-w-sm mx-auto leading-relaxed">
                Notre tuteur littéraire de La Plume évalue scrupuleusement la structure de votre lettre, votre grammaire et le choix de vos connecteurs.
              </p>
            </div>

            {/* Simulated progress indicator */}
            <div className="space-y-2 max-w-xs mx-auto">
              <div className="h-1.5 w-full bg-blue-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-amber-400 transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>
              <span className="text-[11px] font-mono font-black text-amber-400 block">{analysisProgress}% COMPLETE</span>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED RESULTS MODAL/PAGE OVERLAY */}
      {showResults && validationResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full font-mono font-black uppercase">
                  Analyse Littéraire Réussie
                </span>
                <h3 className="text-sm font-black text-slate-800">Évaluation Globale</h3>
              </div>
              <button 
                onClick={() => setShowResults(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-slate-300"
              >
                Fermer
              </button>
            </div>

            {/* Scrollable contents */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-grow">
              
              {/* Score Gauge & Summary Row */}
              <div className="flex flex-col md:flex-row gap-8 items-center justify-between bg-slate-50 p-6 rounded-3xl border border-slate-100">
                
                {/* Visual Circle Score */}
                <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-slate-200" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="10"></circle>
                    <circle 
                      className="text-emerald-500 transition-all duration-1000 ease-out" 
                      cx="80" cy="80" 
                      fill="transparent" 
                      r="70" 
                      stroke="currentColor" 
                      strokeWidth="10"
                      strokeDasharray="440"
                      strokeDashoffset={440 - (440 * validationResult.score) / 20}
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display font-black text-4xl text-slate-800">{validationResult.score}</span>
                    <span className="font-mono text-xs font-black text-slate-400 uppercase">SUR 20</span>
                  </div>
                </div>

                {/* Brief overview Comments */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-display font-black text-lg text-slate-800">
                      {validationResult.score >= 14 ? "Excellent Travail !" : "Bon effort ! continuez à pratiquer."}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                      {validationResult.feedback}
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <span className="text-[10px] font-mono font-black text-emerald-700 block uppercase mb-0.5">POINT FORT</span>
                      <span className="text-xs font-semibold text-slate-700">{validationResult.strengths}</span>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                      <span className="text-[10px] font-mono font-black text-amber-700 block uppercase mb-0.5">À AMÉLIORER</span>
                      <span className="text-xs font-semibold text-slate-700">{validationResult.improvements}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Breakdown by criteria */}
              <div className="space-y-4">
                <h4 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                  Détail par section
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center space-y-1.5 shadow-2xs">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">STRUCTURE</span>
                    <span className="font-mono text-xl font-black text-[#002B5B] block">{validationResult.criteriaScores.structure} <span className="text-xs text-slate-400">/ 4</span></span>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center space-y-1.5 shadow-2xs">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">GRAMMAIRE</span>
                    <span className="font-mono text-xl font-black text-[#002B5B] block">{validationResult.criteriaScores.grammar} <span className="text-xs text-slate-400">/ 6</span></span>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center space-y-1.5 shadow-2xs">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">VOCABULAIRE</span>
                    <span className="font-mono text-xl font-black text-[#002B5B] block">{validationResult.criteriaScores.vocab} <span className="text-xs text-slate-400">/ 6</span></span>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center space-y-1.5 shadow-2xs">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">COHÉRENCE</span>
                    <span className="font-mono text-xl font-black text-[#002B5B] block">{validationResult.criteriaScores.coherence} <span className="text-xs text-slate-400">/ 4</span></span>
                  </div>
                </div>
              </div>

              {/* Grammatical corrections */}
              {validationResult.corrections.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                    Remarques linguistiques &amp; Corrections
                  </h4>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                    {validationResult.corrections.map((corr, idx) => (
                      <div key={idx} className="p-4 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-md font-mono font-bold line-through">
                              {corr.original}
                            </span>
                            <span className="text-slate-400">→</span>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md font-mono font-extrabold">
                              {corr.corrected}
                            </span>
                          </div>
                          <p className="text-slate-600 text-xs leading-normal font-medium">
                            {corr.explanation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested rewrite box */}
              {validationResult.suggestedRewrite && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                      Proposition de Rédaction d'Excellence (IA)
                    </h4>
                    <button
                      onClick={copySuggestedRewrite}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 transition-all"
                    >
                      {copiedText ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          Copié !
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copier la lettre
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-3xl font-serif text-slate-700 text-sm leading-relaxed whitespace-pre-wrap select-all">
                    {validationResult.suggestedRewrite}
                  </div>
                </div>
              )}

            </div>

            {/* Modal footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3 justify-end">
              <button 
                onClick={() => setShowResults(false)}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-slate-200 text-center"
              >
                Fermer le corrigé
              </button>
              <button 
                onClick={() => {
                  setShowResults(false);
                  setCurrentView("parcours");
                }}
                className="px-6 py-3 bg-[#002B5B] hover:bg-opacity-90 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer text-center"
              >
                Continuer le parcours ➔
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
