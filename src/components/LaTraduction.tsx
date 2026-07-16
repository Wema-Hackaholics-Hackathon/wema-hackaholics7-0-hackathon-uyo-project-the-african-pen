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
  AlertCircle,
  Search,
  Book,
  Eye,
  Info,
  HelpCircle
} from "lucide-react";

interface LaTraductionProps {
  userXP: number;
  userStreak: number;
  setCurrentView: (view: string) => void;
  onGainXP: (amount: number) => void;
  isPremium: boolean;
  userFullName: string;
}

interface TranslationCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

interface TranslationValidationResult {
  score: number;
  criteriaScores: {
    fidelity: number;
    vocabulary: number;
    grammar: number;
    fluidity: number;
  };
  corrections: TranslationCorrection[];
  feedback: string;
  strengths: string;
  improvements: string;
  suggestedRewrite: string;
}

export default function LaTraduction({ 
  userXP, 
  userStreak, 
  setCurrentView, 
  onGainXP, 
  isPremium, 
  userFullName 
}: LaTraductionProps) {
  // 4 Paragraphs translations state
  const [translations, setTranslations] = useState<string[]>(["", "", "", ""]);
  const [currentPara, setCurrentPara] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<TranslationValidationResult | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [sideBySide, setSideBySide] = useState<boolean>(false);
  const [lexiconSearch, setLexiconSearch] = useState<string>("");
  const [isLexiconOpen, setIsLexiconOpen] = useState<boolean>(true);
  const [submissionHistory, setSubmissionHistory] = useState<Array<{ date: string; score: number }>>([]);

  const textareasRef = useRef<(HTMLTextAreaElement | null)[]>([]);

  // Source texts & advice
  const sourceParagraphs = [
    {
      num: 1,
      text: "The Economic Community of West African States (ECOWAS) has made significant strides in fostering regional integration. However, achieving full economic proficiency across all member nations remains a complex challenge.",
      hint: "Utilisez l'acronyme officiel « CEDEAO ».",
      tooltips: [
        { word: "Economic Community of West African States", value: "CEDEAO" },
        { word: "proficiency", value: "maîtrise / compétence" }
      ]
    },
    {
      num: 2,
      text: "In recent years, youth employment has become a top priority for the commission. Programs aimed at vocational training are being launched to bridge the skills gap, ensuring that young graduates are ready for a multilingual job market.",
      hint: "Faites attention à la traduction de 'bridge the skills gap'.",
      tooltips: [
        { word: "multilingual", value: "multilingue" },
        { word: "bridge the skills gap", value: "combler le déficit de compétences" }
      ]
    },
    {
      num: 3,
      text: '"Our mission is simple," stated the President. "We want to create a unified space where borders do not hinder progress." This vision requires massive investment in infrastructure and digital literacy.',
      hint: "N'oubliez pas les guillemets français « » pour les citations.",
      tooltips: [
        { word: "unified space", value: "espace unifié" },
        { word: "digital literacy", value: "culture numérique" }
      ]
    },
    {
      num: 4,
      text: "To succeed, the continent must rely on its most valuable asset: human capital. Educational reforms are no longer optional but a necessity for the sustainable development of our African nations.",
      hint: "Utilisez un ton formel pour 'Educational reforms'.",
      tooltips: [
        { word: "most valuable asset", value: "atout le plus précieux" },
        { word: "human capital", value: "capital humain" }
      ]
    }
  ];

  // Lexique items
  const lexiqueItems = [
    { english: "Stakeholders", french: "Parties prenantes" },
    { english: "Sub-region", french: "Sous-région" },
    { english: "Economic proficiency", french: "Maîtrise économique" },
    { english: "Vocational training", french: "Formation professionnelle" },
    { english: "Skills gap", french: "Déficit de compétences" },
    { english: "Unified space", french: "Espace unifié" },
    { english: "Digital literacy", french: "Culture numérique" },
    { english: "Human capital", french: "Capital humain" },
    { english: "Sustainable development", french: "Développement durable" }
  ];

  // Load draft & history from localStorage on mount
  useEffect(() => {
    const savedDrafts = localStorage.getItem("la_traduction_drafts");
    if (savedDrafts) {
      try {
        const parsed = JSON.parse(savedDrafts);
        if (Array.isArray(parsed) && parsed.length === 4) {
          setTranslations(parsed);
        }
      } catch (e) {
        console.error("Failed to parse drafts", e);
      }
    }

    const savedHistory = localStorage.getItem("la_traduction_history");
    if (savedHistory) {
      try {
        setSubmissionHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleTextChange = (text: string, index: number) => {
    const nextTranslations = [...translations];
    nextTranslations[index] = text;
    setTranslations(nextTranslations);
    setIsSaved(false);

    localStorage.setItem("la_traduction_drafts", JSON.stringify(nextTranslations));
    
    // Simulate auto-save status feedback
    const timer = setTimeout(() => {
      setIsSaved(true);
    }, 800);
    return () => clearTimeout(timer);
  };

  const handleSaveDraft = () => {
    localStorage.setItem("la_traduction_drafts", JSON.stringify(translations));
    setIsSaved(true);
  };

  const handleSubmitTranslation = async () => {
    // Basic verification: each paragraph must have some translations
    const unfilledCount = translations.filter(t => t.trim().length < 15).length;
    if (unfilledCount > 0) return;

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
    }, 120);

    try {
      const response = await fetch("/api/gemini/validate-translation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ translations }),
      });

      const result: TranslationValidationResult = await response.json();
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
      localStorage.setItem("la_traduction_history", JSON.stringify(updatedHistory));

      // Award XP
      if (result.score >= 50) {
        onGainXP(350);
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

  const copySuggestedRewrite = () => {
    if (validationResult?.suggestedRewrite) {
      navigator.clipboard.writeText(validationResult.suggestedRewrite);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const filteredLexique = lexiqueItems.filter(item => 
    item.english.toLowerCase().includes(lexiconSearch.toLowerCase()) ||
    item.french.toLowerCase().includes(lexiconSearch.toLowerCase())
  );

  // Checks if a paragraph has valid length translation
  const isParaTranslated = (index: number) => {
    return translations[index].trim().length >= 15;
  };

  // Check if everything is fully translated (at least 15 chars for each of the 4 paras)
  const isAllTranslated = translations.every(t => t.trim().length >= 15);

  // Tooltip Helper: highlighting the special words in paragraph text
  const renderHighlightedText = (paraText: string, tooltips: { word: string, value: string }[]) => {
    let elements: React.ReactNode[] = [paraText];

    tooltips.forEach(tooltip => {
      const updatedElements: React.ReactNode[] = [];
      elements.forEach(el => {
        if (typeof el === "string") {
          const parts = el.split(tooltip.word);
          parts.forEach((part, idx) => {
            updatedElements.push(part);
            if (idx < parts.length - 1) {
              updatedElements.push(
                <span 
                  key={tooltip.word + idx} 
                  className="relative group inline-block border-b border-dotted border-secondary text-primary cursor-help font-bold bg-secondary/5 px-1 rounded hover:bg-secondary/10 transition-colors"
                >
                  {tooltip.word}
                  <span className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-[#001736] text-white text-[11px] px-3 py-1.5 rounded-lg shadow-lg transition-all z-10 font-sans leading-normal">
                    <span className="font-bold text-accent-gold block text-[9px] uppercase tracking-wider mb-0.5">Traduction suggérée :</span>
                    {tooltip.value}
                  </span>
                </span>
              );
            }
          });
        } else {
          updatedElements.push(el);
        }
      });
      elements = updatedElements;
    });

    return <>{elements}</>;
  };

  return (
    <div className="w-full min-h-screen bg-[#fcfcfd] text-slate-800 pb-16 font-sans">
      
      {/* Decorative Tricolor ribbon */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-700 via-white to-red-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Navigation / Breadcrumb */}
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

        {/* Header Hero Card */}
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
          {/* Subtle tricolor gradient accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-tr from-blue-600/5 via-white to-red-600/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 text-[#002B5B] px-3 py-1 rounded-full font-bold text-[10px] tracking-wider">
                <span className="text-amber-500">🏆</span>
                PROJET DE LA SEMAINE 2
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-[#002B5B] tracking-tight">
                La Traduction
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                Traduisez ce passage officiel sur l'intégration et le développement d'Afrique de l'Ouest de l'anglais vers le français.
              </p>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-3 gap-4 border border-slate-100 bg-slate-50/50 p-4 rounded-2xl md:w-96 text-center">
              <div className="space-y-1">
                <div className="flex justify-center"><Clock className="w-4 h-4 text-slate-400" /></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">DURÉE</span>
                <span className="text-xs font-black text-slate-700">50 Min</span>
              </div>
              <div className="space-y-1 border-x border-slate-200">
                <div className="flex justify-center"><Award className="w-4 h-4 text-amber-500" /></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">RÉCOMPENSE</span>
                <span className="text-xs font-black text-emerald-600">+350 XP</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-center"><Calendar className="w-4 h-4 text-rose-500" /></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">ÉCHÉANCE</span>
                <span className="text-xs font-black text-slate-700">Dim. 23:59</span>
              </div>
            </div>
          </div>
        </div>

        {/* Working Area Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Source Text (5 Cols if side-by-side else 6) */}
          <div className={`${sideBySide ? "lg:col-span-5" : "lg:col-span-6"} space-y-6`}>
            
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                    Texte Source en Anglais
                  </h3>
                </div>

                {/* Progress Indicators */}
                <div className="flex gap-1.5" id="progress-dots">
                  {sourceParagraphs.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        isParaTranslated(idx)
                          ? "bg-emerald-500 shadow-xs"
                          : idx === currentPara
                            ? "bg-secondary scale-110"
                            : "bg-slate-200"
                      }`}
                      title={`Paragraphe ${idx + 1}`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Source Paragraphs List */}
              <div className="space-y-4">
                {sourceParagraphs.map((para, idx) => (
                  <div 
                    key={para.num}
                    onClick={() => { if (!sideBySide) setCurrentPara(idx); }}
                    className={`p-4 rounded-2xl border transition-all relative ${
                      sideBySide 
                        ? "bg-slate-50/50 border-slate-100 hover:bg-slate-50"
                        : idx === currentPara
                          ? "bg-blue-50/40 border-blue-200 ring-1 ring-blue-100"
                          : "bg-white border-slate-100 hover:border-slate-200 cursor-pointer"
                    }`}
                  >
                    <div className="absolute top-3 left-3 text-[10px] font-mono font-black text-slate-300">
                      P{para.num}
                    </div>
                    <div className="pl-6 pt-1 text-slate-700 text-xs sm:text-sm leading-relaxed font-serif">
                      {renderHighlightedText(para.text, para.tooltips)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-secondary text-xs">💡</span>
                <span>Passez votre souris sur les termes soulignés pour révéler les conseils lexicaux de traduction officiels.</span>
              </div>
            </div>

          </div>

          {/* Right Side: Translation Editor (7 Cols if side-by-side else 6) */}
          <div className={`${sideBySide ? "lg:col-span-7" : "lg:col-span-6"} space-y-6`}>
            
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs flex flex-col min-h-[500px]">
              
              {/* Tabs or All-in-One Selector */}
              <div className="flex border-b border-slate-100 bg-slate-50/50 overflow-x-auto whitespace-nowrap">
                {sideBySide ? (
                  <div className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    Traduction Complète Côte à Côte
                  </div>
                ) : (
                  sourceParagraphs.map((para, idx) => (
                    <button
                      key={para.num}
                      onClick={() => setCurrentPara(idx)}
                      className={`flex-1 py-4 text-center font-label-md text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                        currentPara === idx
                          ? "border-[#002B5B] text-[#002B5B] bg-white"
                          : "border-transparent text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      Para {para.num}
                      {isParaTranslated(idx) && (
                        <span className="ml-1 text-emerald-500 text-xs">✓</span>
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Editor Workspace Content */}
              <div className="p-6 flex-1 flex flex-col space-y-4">
                
                {/* Header within editor: Conseil & Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                    <span className="text-amber-500">💡</span>
                    <span className="text-slate-400">Conseil :</span>
                    <span className="text-slate-700 italic lowercase first-letter:uppercase font-medium" id="hint-text">
                      {sourceParagraphs[currentPara].hint}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Mode côte à côte</span>
                    <button 
                      onClick={() => setSideBySide(!sideBySide)}
                      className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${sideBySide ? "bg-secondary" : "bg-slate-200"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${sideBySide ? "right-1" : "left-1"}`}></div>
                    </button>
                  </div>
                </div>

                {/* Editor Areas */}
                {sideBySide ? (
                  <div className="space-y-4 flex-grow overflow-y-auto max-h-[480px] pr-1">
                    {sourceParagraphs.map((para, idx) => (
                      <div key={para.num} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-black text-[#002B5B] uppercase">Paragraphe {para.num}</span>
                          <span className="text-[9px] text-slate-400 italic">Anglais: {para.text.slice(0, 40)}...</span>
                        </div>
                        <textarea
                          value={translations[idx]}
                          onChange={(e) => handleTextChange(e.target.value, idx)}
                          placeholder={`Traduisez le paragraphe ${para.num} ici...`}
                          className="w-full h-24 p-3 rounded-xl border border-slate-200 focus:border-secondary focus:ring-1 focus:ring-secondary/20 text-xs sm:text-sm font-serif leading-relaxed bg-slate-50/30"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <textarea
                      value={translations[currentPara]}
                      onChange={(e) => handleTextChange(e.target.value, currentPara)}
                      placeholder={`Écrivez votre traduction française pour le Paragraphe ${currentPara + 1} ici...\n\nSaisie minimale pour validation : 15 caractères.`}
                      className="w-full flex-1 p-5 rounded-2xl border border-slate-200 focus:border-secondary focus:ring-2 focus:ring-secondary/10 resize-none font-serif text-sm sm:text-base leading-relaxed bg-slate-50/20 outline-hidden min-h-[250px]"
                    />
                  </div>
                )}

                {/* Submit / Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className={`w-4 h-4 ${isSaved ? "text-emerald-500" : "text-amber-500 animate-pulse"}`} />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                      {isSaved ? "Brouillon sauvegardé" : "Modification en cours..."}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveDraft}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-black uppercase text-slate-600 transition-all cursor-pointer"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={handleSubmitTranslation}
                      disabled={!isAllTranslated || isAnalyzing}
                      className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition-all ${
                        !isAllTranslated || isAnalyzing
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
                          : "bg-secondary text-white hover:bg-opacity-90 hover:scale-[1.02] active:scale-95 cursor-pointer"
                      }`}
                    >
                      {isAnalyzing ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Analyse en cours...
                        </span>
                      ) : (
                        "Soumettre la Traduction ✨"
                      )}
                    </button>
                  </div>
                </div>

                {!isAllTranslated && (
                  <p className="text-[10px] text-rose-500 font-bold text-right">
                    ⚠️ Veuillez traduire les 4 paragraphes pour pouvoir soumettre.
                  </p>
                )}

              </div>
            </div>

          </div>

        </div>

        {/* Bottom Panel: Dictionary / Lexicon Expandable Accordion */}
        <div className="mt-8 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          
          {/* Header trigger */}
          <button 
            onClick={() => setIsLexiconOpen(!isLexiconOpen)}
            className="w-full px-6 py-5 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                <Book className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                  Lexique Académique &amp; d'Excellence WAEC
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Vocabulaire officiel recommandé pour les examens bilingues.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">
                {lexiqueItems.length} termes officiels
              </span>
              <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isLexiconOpen ? "rotate-90" : ""}`} />
            </div>
          </button>

          {/* Lexicon Content */}
          {isLexiconOpen && (
            <div className="p-6 space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* Search & List column */}
                <div className="md:col-span-1 space-y-3">
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Rechercher un terme..."
                      value={lexiconSearch}
                      onChange={(e) => setLexiconSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/20 bg-slate-50/50"
                    />
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50 bg-white p-1">
                    {filteredLexique.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400 italic">Aucun terme correspondant.</div>
                    ) : (
                      filteredLexique.map((item, idx) => (
                        <div key={idx} className="p-2.5 flex justify-between items-center text-xs">
                          <span className="font-bold text-[#002B5B] font-mono">{item.english}</span>
                          <span className="italic text-slate-500 font-semibold">{item.french}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Stylistic Advice Card */}
                <div className="bg-blue-50/30 border border-blue-100 p-5 rounded-2xl space-y-2">
                  <h5 className="text-[10px] font-mono font-black text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-500" />
                    Note de Style de l'Examinateur
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    "In recent years" se traduit idéalement par <strong className="text-slate-800">« Ces dernières années »</strong> plutôt que « Dans les années récentes », qui est considéré comme un anglicisme lourd.
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    Soignez l'écriture des citations et l'espacement des signes doubles (ex : <strong className="text-slate-800">« Notre mission... »</strong>).
                  </p>
                </div>

                {/* History list column */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-mono font-black text-[#002B5B] uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    Tentatives Précédentes
                  </h5>

                  {submissionHistory.length === 0 ? (
                    <div className="border border-dashed border-slate-200 p-4 rounded-2xl text-center">
                      <p className="text-[10px] text-slate-400 font-medium italic">
                        Aucune soumission enregistrée pour ce projet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {submissionHistory.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold">
                          <div className="space-y-0.5">
                            <span className="text-[9px] text-slate-400 font-bold uppercase block">Le</span>
                            <span className="text-slate-600">{item.date}</span>
                          </div>
                          <span className={`font-mono px-2.5 py-1 rounded-lg text-xs font-black ${
                            item.score >= 80 ? "bg-emerald-50 border border-emerald-200 text-emerald-700" :
                            item.score >= 50 ? "bg-amber-50 border border-amber-200 text-amber-700" :
                            "bg-rose-50 border border-rose-200 text-rose-700"
                          }`}>
                            {item.score}/100
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

      {/* AI PROCESSING MODAL */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-[#001736]/95 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md">
          <div className="max-w-md w-full space-y-6">
            <div className="relative flex justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-blue-900 border-t-amber-400 animate-spin flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display font-black text-2xl text-white">Régie de Correction Académique...</h2>
              <p className="text-blue-200 text-xs sm:text-sm font-semibold max-w-sm mx-auto leading-relaxed">
                Le tuteur littéraire de La Plume évalue la fidélité de votre traduction, votre grammaire, l'élégance de la syntaxe et la justesse de l'acronyme CEDEAO.
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
              <span className="text-[11px] font-mono font-black text-amber-400 block">{analysisProgress}% ANALYSÉ</span>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED RESULTS OVERLAY */}
      {showResults && validationResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full font-mono font-black uppercase">
                  Examen du Projet Terminé
                </span>
                <h3 className="text-sm font-black text-slate-800">Rapport de Traduction Détaillé</h3>
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
                      strokeDashoffset={440 - (440 * validationResult.score) / 100}
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display font-black text-4xl text-slate-800">{validationResult.score}</span>
                    <span className="font-mono text-xs font-black text-slate-400 uppercase">SUR 100</span>
                  </div>
                </div>

                {/* Brief overview Comments */}
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

                  {/* Highlights Grid */}
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

              {/* Breakdown by criteria */}
              <div className="space-y-4">
                <h4 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                  Détail du Barème d'Examen
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center space-y-1.5 shadow-2xs">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">FIDÉLITÉ</span>
                    <span className="font-mono text-lg font-black text-[#002B5B] block">
                      {validationResult.criteriaScores.fidelity} <span className="text-xs text-slate-400">/ 25</span>
                    </span>
                    <p className="text-[9px] text-slate-400 leading-normal">Restitution du sens d'origine.</p>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center space-y-1.5 shadow-2xs">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">VOCABULAIRE</span>
                    <span className="font-mono text-lg font-black text-[#002B5B] block">
                      {validationResult.criteriaScores.vocabulary} <span className="text-xs text-slate-400">/ 25</span>
                    </span>
                    <p className="text-[9px] text-slate-400 leading-normal">Acronymes, termes officiels.</p>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center space-y-1.5 shadow-2xs">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">GRAMMAIRE</span>
                    <span className="font-mono text-lg font-black text-[#002B5B] block">
                      {validationResult.criteriaScores.grammar} <span className="text-xs text-slate-400">/ 25</span>
                    </span>
                    <p className="text-[9px] text-slate-400 leading-normal">Concordance, accords.</p>
                  </div>
                  <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center space-y-1.5 shadow-2xs">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">FLUIDITÉ</span>
                    <span className="font-mono text-lg font-black text-[#002B5B] block">
                      {validationResult.criteriaScores.fluidity} <span className="text-xs text-slate-400">/ 25</span>
                    </span>
                    <p className="text-[9px] text-slate-400 leading-normal">Style naturel, élégance.</p>
                  </div>
                </div>
              </div>

              {/* Specific corrections list */}
              {validationResult.corrections.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                    Analyse comparative &amp; Remarques linguistiques
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

              {/* Suggested rewrite box */}
              {validationResult.suggestedRewrite && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                      Proposition de Traduction Modèle (Correcteur Académique)
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
                          Copier la traduction
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
