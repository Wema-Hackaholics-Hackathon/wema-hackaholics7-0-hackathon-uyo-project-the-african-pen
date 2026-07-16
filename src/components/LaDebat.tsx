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
  AlertTriangle,
  Search,
  Book,
  Eye,
  Info,
  HelpCircle,
  Smartphone,
  Globe,
  Edit,
  Flame,
  Award as PrizeIcon,
  MessageSquare,
  Sparkle,
  Bookmark
} from "lucide-react";

interface LaDebatProps {
  userXP: number;
  userStreak: number;
  setCurrentView: (view: string) => void;
  onGainXP: (amount: number) => void;
  isPremium: boolean;
  userFullName: string;
}

interface DebateCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

interface DebateValidationResult {
  score: number;
  criteriaScores: {
    structure: number;
    arguments: number;
    vocabulary: number;
    grammar: number;
    connectors: number;
  };
  corrections: DebateCorrection[];
  feedback: string;
  strengths: string;
  improvements: string;
  suggestedRewrite: string;
}

interface Topic {
  id: number;
  title: string;
  level: "Intermédiaire" | "Avancé";
  levelColor: string;
  description: string;
  icon: React.ComponentType<any>;
  vocabulary: string[];
}

export default function LaDebat({ 
  userXP, 
  userStreak, 
  setCurrentView, 
  onGainXP, 
  isPremium, 
  userFullName 
}: LaDebatProps) {
  // Topics catalog
  const topics: Topic[] = [
    {
      id: 1,
      title: "Les téléphones portables à l'école",
      level: "Intermédiaire",
      levelColor: "text-secondary bg-blue-50 border-blue-200",
      description: "Faut-il autoriser ou interdire l'usage des smartphones dans l'enceinte des établissements scolaires ?",
      icon: Smartphone,
      vocabulary: ["Numérique", "Distraction", "Apprentissage", "Cyber-harcèlement", "Outil pédagogique", "Réglementation", "Interdiction", "Socialisation"]
    },
    {
      id: 2,
      title: "Le français en Afrique",
      level: "Avancé",
      levelColor: "text-rose-700 bg-rose-50 border-rose-200",
      description: "L'évolution de la langue française sur le continent : une opportunité ou un frein culturel ?",
      icon: Globe,
      vocabulary: ["Francophonie", "Héritage colonial", "Langue véhiculaire", "Identité", "Plurilinguisme", "Rayonnement mondial", "Emprunt linguistique", "Enracinement"]
    },
    {
      id: 3,
      title: "Les examens nationaux",
      level: "Intermédiaire",
      levelColor: "text-secondary bg-blue-50 border-blue-200",
      description: "Sont-ils toujours le meilleur moyen d'évaluer les compétences d'un étudiant au 21ème siècle ?",
      icon: Edit,
      vocabulary: ["Évaluation", "Mérite", "Performance", "Contrôle continu", "Compétences", "Système éducatif", "Égalité des chances", "Sélection"]
    }
  ];

  // Editor sections config
  const sectionsConfig = [
    { name: "Introduction", targetWords: 50, placeholder: "Commencez à rédiger votre introduction ici (présentation du sujet et problématique)..." },
    { name: "Pour (Arguments)", targetWords: 100, placeholder: "Développez vos arguments favorables. Donnez des exemples précis..." },
    { name: "Contre (Arguments)", targetWords: 100, placeholder: "Développez les arguments opposés avec la même rigueur logique..." },
    { name: "Nuance", targetWords: 50, placeholder: "Apportez une perspective nuancée, en pesant le pour et le contre..." },
    { name: "Conclusion", targetWords: 50, placeholder: "Rédigez le bilan final et ouvrez sur une perspective plus large..." }
  ];

  const totalMinWords = 350; // Required total words

  // State
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isTopicConfirmed, setIsTopicConfirmed] = useState<boolean>(false);
  
  // Section content: Array of 5 strings for each paragraph
  const [sectionsText, setSectionsText] = useState<string[]>(["", "", "", "", ""]);
  const [activeTab, setActiveTab] = useState<number>(0);
  
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<DebateValidationResult | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // History
  const [submissionHistory, setSubmissionHistory] = useState<Array<{ date: string; topicTitle: string; score: number }>>([]);

  // Ref for active textareas
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  // Load state and drafts
  useEffect(() => {
    // History load
    const savedHistory = localStorage.getItem("la_debat_history");
    if (savedHistory) {
      try {
        setSubmissionHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse debate history", e);
      }
    }
  }, []);

  // Handle draft loading when topic is selected
  useEffect(() => {
    if (selectedTopic) {
      const savedDrafts = localStorage.getItem(`la_debat_drafts_${selectedTopic.id}`);
      if (savedDrafts) {
        try {
          const parsed = JSON.parse(savedDrafts);
          if (Array.isArray(parsed) && parsed.length === 5) {
            setSectionsText(parsed);
          } else {
            setSectionsText(["", "", "", "", ""]);
          }
        } catch (e) {
          setSectionsText(["", "", "", "", ""]);
        }
      } else {
        setSectionsText(["", "", "", "", ""]);
      }
    }
  }, [selectedTopic]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  const handleTextChange = (text: string, index: number) => {
    const updated = [...sectionsText];
    updated[index] = text;
    setSectionsText(updated);
    setIsSaved(false);

    if (selectedTopic) {
      localStorage.setItem(`la_debat_drafts_${selectedTopic.id}`, JSON.stringify(updated));
    }

    // Auto save effect
    const timer = setTimeout(() => {
      setIsSaved(true);
    }, 600);
    return () => clearTimeout(timer);
  };

  // Helper to count words in a string
  const getWordCount = (text: string): number => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

  const totalWords = sectionsText.reduce((acc, text) => acc + getWordCount(text), 0);
  const progressPercentage = Math.min(Math.round((totalWords / totalMinWords) * 100), 100);

  // Logical connectors list
  const connectors = [
    { word: "Cependant", label: "Concession / Opposition" },
    { word: "En revanche", label: "Opposition" },
    { word: "Néanmoins", label: "Nuance" },
    { word: "Par conséquent", label: "Conséquence" },
    { word: "Par ailleurs", label: "Addition / Transition" },
    { word: "De surcroît", label: "Addition forte" },
    { word: "Certes", label: "Concession" },
    { word: "Par exemple", label: "Illustration" }
  ];

  // Insert connector/vocab into current active cursor position
  const insertText = (word: string) => {
    const currentRef = textareaRefs.current[activeTab];
    if (currentRef) {
      const text = sectionsText[activeTab];
      const start = currentRef.selectionStart;
      const end = currentRef.selectionEnd;
      
      const newText = text.substring(0, start) + (start === 0 ? "" : " ") + word + " " + text.substring(end);
      handleTextChange(newText, activeTab);
      
      // Reset cursor position
      setTimeout(() => {
        currentRef.focus();
        const nextPos = start + word.length + (start === 0 ? 1 : 2);
        currentRef.setSelectionRange(nextPos, nextPos);
      }, 50);

      showToast(`« ${word} » inséré dans le paragraphe !`);
    } else {
      // Just append
      const text = sectionsText[activeTab];
      const newText = text + (text.length > 0 ? " " : "") + word + " ";
      handleTextChange(newText, activeTab);
      showToast(`« ${word} » ajouté à la fin !`);
    }
  };

  const handleSubmitDebate = async () => {
    if (totalWords < totalMinWords || !selectedTopic) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setShowResults(false);

    // Simulated progress loader
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 100);

    try {
      const response = await fetch("/api/gemini/validate-debate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topic: selectedTopic.title,
          sections: sectionsText
        })
      });

      const result: DebateValidationResult = await response.json();
      clearInterval(interval);
      setAnalysisProgress(100);

      // Save to history list
      const newHistoryItem = {
        date: new Date().toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        }),
        topicTitle: selectedTopic.title,
        score: result.score
      };

      const updatedHistory = [newHistoryItem, ...submissionHistory];
      setSubmissionHistory(updatedHistory);
      localStorage.setItem("la_debat_history", JSON.stringify(updatedHistory));

      // Award XP
      if (result.score >= 50) {
        onGainXP(500);
      }

      setValidationResult(result);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
      }, 500);

    } catch (error) {
      console.error("Failed to analyze debate", error);
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };

  const copySuggestedRewrite = () => {
    if (validationResult?.suggestedRewrite) {
      navigator.clipboard.writeText(validationResult.suggestedRewrite);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fcfcfd] text-slate-800 pb-16 font-sans">
      
      {/* Decorative Ribbon */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-700 via-white to-red-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Navigation Breadcrumbs */}
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

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-tr from-blue-600/5 via-white to-red-600/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 text-[#002B5B] px-3 py-1 rounded-full font-bold text-[10px] tracking-wider">
                <span>✍️</span>
                PROJET FINAL DE LA SEMAINE 3
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-[#002B5B] tracking-tight">
                Le Débat
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                Rédigez un essai argumentatif en français — développez des arguments convaincants pour et contre un grand sujet de société africain ou mondial.
              </p>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-3 gap-4 border border-slate-100 bg-slate-50/50 p-4 rounded-2xl md:w-96 text-center">
              <div className="space-y-1">
                <div className="flex justify-center"><Clock className="w-4 h-4 text-slate-400" /></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">DURÉE</span>
                <span className="text-xs font-black text-slate-700">60 Min</span>
              </div>
              <div className="space-y-1 border-x border-slate-200">
                <div className="flex justify-center"><PrizeIcon className="w-4 h-4 text-amber-500" /></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">RÉCOMPENSE</span>
                <span className="text-xs font-black text-emerald-600">+500 XP</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-center"><Calendar className="w-4 h-4 text-rose-500" /></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">ÉCHÉANCE</span>
                <span className="text-xs font-black text-slate-700">Dim. 23:59</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Topic Selection Card Grid */}
        {!isTopicConfirmed ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#001736] to-[#002B5B] text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-md">
              <div className="relative z-10 space-y-2">
                <h2 className="font-display font-black text-lg sm:text-xl flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-amber-400" />
                  SÉLECTIONNEZ VOTRE SUJET DE DÉBAT
                </h2>
                <p className="opacity-80 text-xs sm:text-sm max-w-xl font-medium">
                  Chaque sujet dispose d'un lexique de mots thématiques recommandés et de conseils spécifiques de correction WAEC. Choisissez-en un pour commencer à rédiger votre essai.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topics.map((topic) => {
                const TopicIcon = topic.icon;
                const isSelected = selectedTopic?.id === topic.id;
                return (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`group relative flex flex-col text-left p-6 bg-white rounded-3xl border-2 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer ${
                      isSelected 
                        ? "border-[#002B5B] bg-blue-50/10 ring-1 ring-blue-100" 
                        : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <div className="w-12 h-12 bg-slate-50 text-[#002B5B] border border-slate-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#002B5B]/5 transition-colors">
                      <TopicIcon className="w-5 h-5" />
                    </div>
                    
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border w-fit mb-3 ${topic.levelColor}`}>
                      {topic.level}
                    </span>

                    <h3 className="font-display font-black text-base text-[#001736] mb-2 group-hover:text-secondary transition-colors">
                      {topic.title}
                    </h3>
                    
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed flex-grow">
                      {topic.description}
                    </p>

                    <div className="mt-5 pt-3 border-t border-slate-50 flex items-center text-xs font-black text-[#002B5B] uppercase tracking-wider">
                      Sélectionner ce sujet ➔
                    </div>

                    {isSelected && (
                      <div className="absolute top-4 right-4 text-emerald-500">
                        <CheckCircle2 className="w-5 h-5 fill-emerald-50" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedTopic && (
              <div className="flex justify-center pt-4 animate-fade-in">
                <button
                  onClick={() => setIsTopicConfirmed(true)}
                  className="bg-[#002B5B] hover:bg-opacity-90 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  CONFIRMER LE SUJET &amp; ACCÉDER À L'ÉDITEUR
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Step 2: Essay Editor */
          <div className="space-y-6 animate-fade-in">
            
            {/* Active Topic Banner */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-[#002B5B] rounded-2xl flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Sujet actif</span>
                  <h2 className="font-display font-black text-base text-[#002B5B]">{selectedTopic?.title}</h2>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsTopicConfirmed(false);
                  setSelectedTopic(null);
                }}
                className="px-4 py-2 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-rose-600 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Changer de sujet
              </button>
            </div>

            {/* Structured progress header */}
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-2xs">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-[#002B5B]" />
                <h3 className="font-display font-black text-xs uppercase tracking-wider text-[#002B5B]">
                  Structure requise d'un essai argumentatif
                </h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {sectionsConfig.map((sect, idx) => {
                  const words = getWordCount(sectionsText[idx]);
                  const isDone = words >= sect.targetWords;
                  return (
                    <div 
                      key={sect.name}
                      onClick={() => setActiveTab(idx)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        activeTab === idx
                          ? "bg-blue-50/50 border-blue-300 ring-1 ring-blue-100"
                          : isDone 
                            ? "bg-emerald-50/20 border-emerald-100 hover:bg-slate-50"
                            : "bg-slate-50/30 border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span className={`w-5 h-5 text-[10px] font-black rounded-full flex items-center justify-center ${
                          isDone ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"
                        }`}>
                          {isDone ? "✓" : idx + 1}
                        </span>
                        <span className="text-[10px] font-bold text-slate-700">{sect.name}</span>
                      </div>
                      <div className="text-[10px] font-mono font-bold text-slate-400">
                        {words} / {sect.targetWords} mots
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Editor Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: text area editor */}
              <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs">
                
                {/* Horizontal tabs */}
                <div className="flex border-b border-slate-100 bg-slate-50/50 overflow-x-auto whitespace-nowrap">
                  {sectionsConfig.map((sect, idx) => {
                    const words = getWordCount(sectionsText[idx]);
                    const isDone = words >= sect.targetWords;
                    return (
                      <button
                        key={sect.name}
                        onClick={() => setActiveTab(idx)}
                        className={`flex-1 py-4 px-3 text-center font-label-md text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                          activeTab === idx
                            ? "border-[#002B5B] text-[#002B5B] bg-white"
                            : "border-transparent text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        {idx + 1}. {sect.name}
                        {isDone && <span className="ml-1 text-emerald-500">✓</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Text Area */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Paragraphe {activeTab + 1} : {sectionsConfig[activeTab].name}
                    </span>
                    <span className="text-xs font-mono font-black text-[#002B5B]">
                      Cible : ~{sectionsConfig[activeTab].targetWords} mots
                    </span>
                  </div>

                  <textarea
                    ref={el => { textareaRefs.current[activeTab] = el; }}
                    value={sectionsText[activeTab]}
                    onChange={(e) => handleTextChange(e.target.value, activeTab)}
                    placeholder={sectionsConfig[activeTab].placeholder}
                    className="w-full h-80 p-5 rounded-2xl border border-slate-200 focus:border-secondary focus:ring-2 focus:ring-secondary/10 resize-none font-serif text-sm sm:text-base leading-relaxed bg-slate-50/10 outline-hidden"
                  />

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <CheckCircle2 className={`w-4 h-4 ${isSaved ? "text-emerald-500" : "text-amber-500 animate-pulse"}`} />
                      <span className="font-bold uppercase tracking-wide text-[10px]">
                        {isSaved ? "Sauvegardé localement" : "Modification..."}
                      </span>
                    </div>
                    
                    <span className="font-mono font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                      {getWordCount(sectionsText[activeTab])} mots
                    </span>
                  </div>
                </div>

              </div>

              {/* Right Column: Interactive panels (Sidebar) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Logical Connectors list */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                    <Book className="w-4 h-4 text-secondary" />
                    <h3 className="font-display font-black text-xs uppercase tracking-wider text-slate-800">
                      Connecteurs Logiques
                    </h3>
                  </div>

                  <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                    Cliquez sur un connecteur logique officiel pour l'insérer directement à l'emplacement de votre curseur de frappe.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {connectors.map((c) => (
                      <button
                        key={c.word}
                        onClick={() => insertText(c.word)}
                        title={c.label}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-[#002B5B] hover:bg-blue-50 text-xs font-black text-slate-700 rounded-xl transition-all cursor-pointer"
                      >
                        {c.word}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contextual vocabulary thématique */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <h3 className="font-display font-black text-xs uppercase tracking-wider text-slate-800">
                      Lexique Thématique Conseillé
                    </h3>
                  </div>

                  <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                    L'utilisation de vocabulaire thématique précis augmente significativement votre score d'expression écrite. Cliquez pour les insérer.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {selectedTopic?.vocabulary.map((vocab) => (
                      <button
                        key={vocab}
                        onClick={() => insertText(vocab)}
                        className="px-3 py-1.5 bg-amber-50/50 border border-amber-100 hover:border-amber-400 hover:bg-amber-100 text-xs font-bold text-amber-900 rounded-xl transition-all cursor-pointer"
                      >
                        {vocab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exam Board Advice */}
                <div className="bg-gradient-to-br from-[#001736] to-slate-900 text-white p-6 rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-amber-400">
                    <Sparkles className="w-4 h-4" />
                    <h3 className="font-display font-black text-xs uppercase tracking-wider">
                      Critères d'Examen WAEC
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    <li className="flex gap-2.5 items-start">
                      <span className="text-emerald-500 text-xs mt-0.5">✓</span>
                      <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                        <strong>Impartialité</strong> : Vos sections Pour et Contre doivent être d'une longueur et d'une force d'argumentation similaires.
                      </p>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <span className="text-emerald-500 text-xs mt-0.5">✓</span>
                      <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                        <strong>Logique</strong> : Liez vos idées avec des connecteurs et utilisez des subjonctifs pour exprimer la nécessité.
                      </p>
                    </li>
                    <li className="flex gap-2.5 items-start">
                      <span className="text-emerald-500 text-xs mt-0.5">✓</span>
                      <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                        <strong>Nuance &amp; Conclusion</strong> : La nuance sert à peser le pour et le contre tandis que la conclusion ouvre sur une question plus globale.
                      </p>
                    </li>
                  </ul>
                </div>

              </div>

            </div>

            {/* Sticky Submission Footer */}
            <div className="bg-white border border-slate-200 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-5 shadow-xs">
              <div className="flex-1 w-full max-w-lg">
                <div className="flex justify-between text-xs font-black text-[#002B5B] mb-2">
                  <span className="uppercase tracking-wider">Avancement de l'essai</span>
                  <span>{totalWords} / {totalMinWords} mots ({progressPercentage}%)</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      totalWords >= totalMinWords ? "bg-emerald-500" : "bg-amber-400"
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                {totalWords < totalMinWords && (
                  <p className="text-xs font-bold text-rose-500 max-w-xs leading-normal">
                    ⚠️ Minimum {totalMinWords} mots requis au total pour soumettre l'examen (Actuel : {totalWords} mots).
                  </p>
                )}
                
                <button
                  onClick={handleSubmitDebate}
                  disabled={totalWords < totalMinWords || isAnalyzing}
                  className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-all w-full md:w-auto ${
                    totalWords < totalMinWords || isAnalyzing
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
                      : "bg-[#002B5B] text-white hover:bg-opacity-90 hover:scale-[1.02] active:scale-95 cursor-pointer"
                  }`}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Analyse de l'Essai en cours...
                    </span>
                  ) : (
                    "Soumettre l'Essai de Débat ✨"
                  )}
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* AI ANALYSIS ANIMATION MODAL */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-[#001736]/95 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md">
          <div className="max-w-md w-full space-y-6">
            <div className="relative flex justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-blue-900 border-t-amber-400 animate-spin flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display font-black text-2xl text-white">Régie de Correction d'Argumentation...</h2>
              <p className="text-blue-200 text-xs sm:text-sm font-semibold max-w-sm mx-auto leading-relaxed">
                Le tuteur de rhétorique littéraire de La Plume évalue la structure de votre plan, la force argumentative de vos thèses, votre syntaxe et la variété de vos connecteurs de transition.
              </p>
            </div>

            <div className="space-y-2 max-w-xs mx-auto">
              <div className="h-1.5 w-full bg-blue-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-amber-400 transition-all duration-300"
                  style={{ width: `${analysisProgress}%` }}
                ></div>
              </div>
              <span className="text-[11px] font-mono font-black text-amber-400 block">{analysisProgress}% ANALYSÉ</span>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED RESULTS OVERLAY */}
      {showResults && validationResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full font-mono font-black uppercase">
                  Examen de Débat Terminé
                </span>
                <h3 className="text-sm font-black text-slate-800">Rapport de Rhetorique &amp; d'Argumentation</h3>
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
              
              {/* Score Gauge */}
              <div className="flex flex-col md:flex-row gap-8 items-center justify-between bg-slate-50 p-6 rounded-3xl border border-slate-100">
                
                {/* Visual circle gauge */}
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
                      strokeDashoffset={440 - (440 * validationResult.score) / 100}
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display font-black text-4xl text-slate-800">{validationResult.score}</span>
                    <span className="font-mono text-xs font-black text-slate-400 uppercase">SUR 100</span>
                  </div>
                </div>

                {/* Feedback comment */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-100 text-amber-700 rounded-full">
                      <span className="text-xs">✨</span>
                      <span className="font-mono text-[10px] font-black uppercase tracking-wider">
                        Mention : {validationResult.score >= 80 ? "Très Bien" : validationResult.score >= 65 ? "Bien" : "Passable"}
                      </span>
                    </div>
                    <h3 className="font-display font-black text-lg text-slate-800">
                      Feedback de l'IA La Plume
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold">
                      {validationResult.feedback}
                    </p>
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2">
                      <span className="text-emerald-500 text-xs">✓</span>
                      <div>
                        <span className="text-[9px] font-mono font-black text-emerald-700 block uppercase mb-0.5">POINT FORT</span>
                        <span className="text-[11px] font-bold text-slate-700">{validationResult.strengths}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2">
                      <span className="text-amber-500 text-xs">⚠️</span>
                      <div>
                        <span className="text-[9px] font-mono font-black text-amber-700 block uppercase mb-0.5">À AMÉLIORER</span>
                        <span className="text-[11px] font-bold text-slate-700">{validationResult.improvements}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Grid Breakdown */}
              <div className="space-y-4">
                <h4 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                  Grille d'Évaluation de l'Examinateur
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3 bg-white border border-slate-200 rounded-2xl text-center space-y-1 shadow-2xs">
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block">STRUCTURE</span>
                    <span className="font-mono text-base font-black text-[#002B5B] block">
                      {validationResult.criteriaScores.structure} <span className="text-xs text-slate-400">/ 20</span>
                    </span>
                    <p className="text-[9px] text-slate-400 leading-tight">Enchaînement du plan.</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-2xl text-center space-y-1 shadow-2xs">
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block">ARGUMENTS</span>
                    <span className="font-mono text-base font-black text-[#002B5B] block">
                      {validationResult.criteriaScores.arguments} <span className="text-xs text-slate-400">/ 20</span>
                    </span>
                    <p className="text-[9px] text-slate-400 leading-tight">Équilibre pour/contre.</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-2xl text-center space-y-1 shadow-2xs">
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block">VOCABULAIRE</span>
                    <span className="font-mono text-base font-black text-[#002B5B] block">
                      {validationResult.criteriaScores.vocabulary} <span className="text-xs text-slate-400">/ 20</span>
                    </span>
                    <p className="text-[9px] text-slate-400 leading-tight">Mots thématiques employés.</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-2xl text-center space-y-1 shadow-2xs">
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block">GRAMMAIRE</span>
                    <span className="font-mono text-base font-black text-[#002B5B] block">
                      {validationResult.criteriaScores.grammar} <span className="text-xs text-slate-400">/ 20</span>
                    </span>
                    <p className="text-[9px] text-slate-400 leading-tight">Concordance, modes.</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-2xl text-center space-y-1 shadow-2xs">
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase block">CONNECTEURS</span>
                    <span className="font-mono text-base font-black text-[#002B5B] block">
                      {validationResult.criteriaScores.connectors} <span className="text-xs text-slate-400">/ 20</span>
                    </span>
                    <p className="text-[9px] text-slate-400 leading-tight">Cohésion textuelle.</p>
                  </div>
                </div>
              </div>

              {/* Corrections list */}
              {validationResult.corrections.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                    Remarques linguistiques &amp; Style
                  </h4>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                    {validationResult.corrections.map((corr, idx) => (
                      <div key={idx} className="p-4 bg-slate-50/50 flex flex-col md:flex-row gap-4 items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100 rounded-md font-mono font-bold line-through">
                              {corr.original || "[Vide]"}
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

              {/* Model Essay Suggested Rewrite */}
              {validationResult.suggestedRewrite && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                      Essai Modèle (Rédigé par le Correcteur d'IA)
                    </h4>
                    <button
                      onClick={copySuggestedRewrite}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-600 transition-all cursor-pointer"
                    >
                      {copiedText ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          Copié !
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copier l'essai modèle
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

      {/* Global custom Toast messages */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#001736] border border-blue-900 text-white px-4 py-3 rounded-2xl flex items-center gap-2 shadow-2xl animate-fade-in text-xs font-bold font-mono">
          <Sparkle className="w-4 h-4 text-amber-400 animate-spin" />
          {toastMessage}
        </div>
      )}

    </div>
  );
}
