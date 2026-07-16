/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Bookmark, Circle, ClipboardList, FileText, Lightbulb, Play, 
  ChevronLeft, ChevronRight, LogOut, ArrowLeft, Star, Volume2, 
  CheckCircle2, Clock, ShieldAlert, Award, Menu, BookOpen
} from "lucide-react";

interface LessonViewerProps {
  userXP: number;
  userStreak: number;
  setCurrentView: (view: string) => void;
  onGainXP: (amount: number) => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: { key: string; label: string }[];
  correctKey: string;
  explanationCorrect: string;
  explanationIncorrect: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "« ___ histoire de l'Afrique est riche. »",
    options: [
      { key: "A", label: "La" },
      { key: "B", label: "Le" },
      { key: "C", label: "L'" },
      { key: "D", label: "Les" }
    ],
    correctKey: "C",
    explanationCorrect: "Excellent ! Devant le mot 'histoire' (qui commence par un 'h' muet), on utilise l'élision 'l'' pour éviter le choc de deux voyelles (hiatus).",
    explanationIncorrect: "Oups ! Bien que 'histoire' soit un nom féminin, l'élision 'l'' est obligatoire devant un 'h' muet ou une voyelle. 'La histoire' est incorrect."
  },
  {
    id: 2,
    question: "« C’est ___ homme courageux dont tout le monde parle. »",
    options: [
      { key: "A", label: "l'" },
      { key: "B", label: "le" },
      { key: "C", label: "la" },
      { key: "D", label: "un" }
    ],
    correctKey: "A",
    explanationCorrect: "Correct ! Le mot 'homme' commence par un 'h' muet. On applique donc l'élision de l'article 'le' en 'l''.",
    explanationIncorrect: "Oups ! Devant un 'h' muet comme dans 'homme', l'article 'le' se contracte par élision en 'l''."
  },
  {
    id: 3,
    question: "« Nous irons ___ école d'Abidjan dès la rentrée. »",
    options: [
      { key: "A", label: "à la" },
      { key: "B", label: "au" },
      { key: "C", label: "à l'" },
      { key: "D", label: "aux" }
    ],
    correctKey: "C",
    explanationCorrect: "Exact ! Devant un nom féminin singulier commençant par une voyelle comme 'école', la préposition 'à' s'associe à l'article élidé : 'à l'école'.",
    explanationIncorrect: "Oups ! 'école' commence par une voyelle ('é'). La forme correcte est 'à l'école' et non 'à la école'."
  },
  {
    id: 4,
    question: "« ___ haricots verts sont excellents pour la santé. »",
    options: [
      { key: "A", label: "L'" },
      { key: "B", label: "Les" },
      { key: "C", label: "Le" },
      { key: "D", label: "Des" }
    ],
    correctKey: "B",
    explanationCorrect: "Félicitations ! C'est le piège classique du H aspiré. Le mot 'haricot' commence par un 'h' aspiré : l'élision est interdite, on emploie 'Les'.",
    explanationIncorrect: "Oups ! C'est le piège classique du WAEC. Le 'h' de 'haricot' est aspiré : l'élision est interdite, on écrit donc 'Les haricots' et non 'L'haricot'."
  },
  {
    id: 5,
    question: "« Il a obtenu ___ cahiers indispensables pour le cours. »",
    options: [
      { key: "A", label: "le" },
      { key: "B", label: "la" },
      { key: "C", label: "les" },
      { key: "D", label: "l'" }
    ],
    correctKey: "C",
    explanationCorrect: "Bravo ! 'Cahiers' est au pluriel, l'article défini pluriel est 'les' pour les deux genres.",
    explanationIncorrect: "Oups ! 'Cahiers' est un nom au pluriel. L'article défini pluriel adéquat est 'les'."
  },
  {
    id: 6,
    question: "« ___ courage de ce candidat est admirable. »",
    options: [
      { key: "A", label: "Le" },
      { key: "B", label: "La" },
      { key: "C", label: "L'" },
      { key: "D", label: "Un" }
    ],
    correctKey: "A",
    explanationCorrect: "Correct ! Le mot 'courage' est masculin singulier et commence par une consonne, donc l'article défini approprié est 'Le'.",
    explanationIncorrect: "Oups ! 'Courage' est un nom masculin singulier. L'article défini correspondant est donc 'Le'."
  },
  {
    id: 7,
    question: "« Veuillez rendre ce livre ___ professeur de français. »",
    options: [
      { key: "A", label: "à le" },
      { key: "B", label: "au" },
      { key: "C", label: "aux" },
      { key: "D", label: "du" }
    ],
    correctKey: "B",
    explanationCorrect: "Exact ! La préposition 'à' se contracte avec l'article défini masculin 'le' pour donner 'au' (à + le = au).",
    explanationIncorrect: "Oups ! La juxtaposition 'à le' est impossible en français moderne. Elle se contracte obligatoirement en 'au'."
  },
  {
    id: 8,
    question: "« ___ vacances d'été approchent à grands pas. »",
    options: [
      { key: "A", label: "Le" },
      { key: "B", label: "La" },
      { key: "C", label: "Les" },
      { key: "D", label: "L'" }
    ],
    correctKey: "C",
    explanationCorrect: "Bien joué ! Le nom 'vacances' s'emploie toujours au pluriel pour de longs séjours, on utilise donc l'article 'Les'.",
    explanationIncorrect: "Oups ! 'Vacances' s'accorde au pluriel. L'article défini requis est 'Les'."
  },
  {
    id: 9,
    question: "« Il parle souvent ___ réussite de ses élèves. »",
    options: [
      { key: "A", label: "de la" },
      { key: "B", label: "du" },
      { key: "C", label: "de l'" },
      { key: "D", label: "des" }
    ],
    correctKey: "A",
    explanationCorrect: "Parfait ! 'Réussite' est un nom féminin singulier commençant par une consonne. On emploie l'expression 'de la'.",
    explanationIncorrect: "Oups ! 'Réussite' est féminin singulier. La construction correcte est 'de la réussite'."
  },
  {
    id: 10,
    question: "« ___ humanité entière célèbre cette découverte. »",
    options: [
      { key: "A", label: "La" },
      { key: "B", label: "L'" },
      { key: "C", label: "Le" },
      { key: "D", label: "Les" }
    ],
    correctKey: "B",
    explanationCorrect: "Félicitations ! Le mot 'humanité' commence par un H muet, provoquant l'élision obligatoire de l'article 'la' en 'l''.",
    explanationIncorrect: "Oups ! Devant le H muet de 'humanité', l'article féminin 'la' s'élide obligatoirement en 'l''."
  },
  {
    id: 11,
    question: "« ___ oiseaux migrateurs survolent la lagune. »",
    options: [
      { key: "A", label: "L'" },
      { key: "B", label: "Le" },
      { key: "C", label: "Les" },
      { key: "D", label: "Des" }
    ],
    correctKey: "C",
    explanationCorrect: "Excellent ! 'Oiseaux' est un nom pluriel. On emploie donc l'article défini pluriel 'Les'.",
    explanationIncorrect: "Oups ! 'Oiseaux' étant au pluriel, l'article défini pluriel correct est 'Les'."
  }
];

export default function LessonViewer({ 
  userXP, 
  userStreak, 
  setCurrentView,
  onGainXP 
}: LessonViewerProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(258); // 4 minutes and 18 seconds matching the screenshot
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [xpClaimed, setXpClaimed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Step 2 Multi-question Quiz state
  const [quizStarted, setQuizStarted] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizIsAnswerSubmitted, setQuizIsAnswerSubmitted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizScore, setQuizScore] = useState(0);

  const [isCapsule12Playing, setIsCapsule12Playing] = useState(false);
  const [capsule12Progress, setCapsule12Progress] = useState(0);

  const lessonIntroVideo = new URL(
    "../assets/videos/vidssave.com Learn French from Zero - French Absolute Beginners Guide 240P.mp4",
    import.meta.url
  ).href;

  // Simulate Capsule 1.2 video player
  useEffect(() => {
    let videoInterval: any;
    if (isCapsule12Playing) {
      videoInterval = setInterval(() => {
        setCapsule12Progress((prev) => {
          if (prev >= 100) {
            setIsCapsule12Playing(false);
            clearInterval(videoInterval);
            return 100;
          }
          return prev + 1.5;
        });
      }, 500);
    }
    return () => clearInterval(videoInterval);
  }, [isCapsule12Playing]);

  // Countdown timer for focus session
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0 && !xpClaimed) {
      onGainXP(25);
      setXpClaimed(true);
    }
  }, [secondsLeft, xpClaimed, onGainXP]);

  // Video progress simulation
  useEffect(() => {
    let videoInterval: any;
    if (isPlayingVideo) {
      videoInterval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingVideo(false);
            clearInterval(videoInterval);
            return 100;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(videoInterval);
  }, [isPlayingVideo]);

  // Format timer seconds into MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Steps matching the Left Sidebar list
  const steps = [
    {
      id: 1,
      title: "1. Introduction Générale",
      status: activeStep === 1 ? "En cours • 5 min" : "Terminé • 5 min",
      type: activeStep === 1 ? "active" : activeStep > 1 ? "completed" : "upcoming",
      icon: Bookmark
    },
    {
      id: 2,
      title: "2. Les Articles Définis",
      status: activeStep < 2 ? "À venir • 8 min" : activeStep === 2 ? "En cours • 8 min" : "Terminé • 8 min",
      type: activeStep === 2 ? "active" : activeStep > 2 ? "completed" : "upcoming",
      icon: BookOpen
    },
    {
      id: 3,
      title: "3. Les Articles Indéfinis",
      status: activeStep < 3 ? "À venir • 7 min" : activeStep === 3 ? "En cours • 7 min" : "Terminé • 7 min",
      type: activeStep === 3 ? "active" : activeStep > 3 ? "completed" : "upcoming",
      icon: Circle
    },
    {
      id: 4,
      title: "4. Exercice d'Application",
      status: activeStep < 4 ? "Évaluation • 10 questions" : activeStep === 4 ? "En cours • 10 questions" : "Terminé • 10 questions",
      type: activeStep === 4 ? "active" : activeStep > 4 ? "completed" : "upcoming",
      icon: ClipboardList,
      hasBadge: true
    },
    {
      id: 5,
      title: "5. Résumé & Devoir",
      status: activeStep < 5 ? "Finalisation • 4 min" : "En cours • 4 min",
      type: activeStep === 5 ? "active" : "upcoming",
      icon: FileText
    }
  ];

  const handleNextStep = () => {
    if (activeStep < 5) {
      setActiveStep(activeStep + 1);
    } else {
      // Finished all parts, return to Parcours map with a bonus
      onGainXP(50);
      setCurrentView("parcours");
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  // Calculate focal timer angle/dash offset (based on 300s total, or 258 left of 300)
  const totalDuration = 300;
  const strokeDasharray = 2 * Math.PI * 54; // radius is 54
  const strokeDashoffset = strokeDasharray * (1 - secondsLeft / totalDuration);

  return (
    <div className="w-full min-h-screen bg-white text-slate-800 flex flex-col font-sans antialiased">
      
      {/* 1. Header Area matching the screenshot */}
      <header className="w-full h-16 border-b border-slate-100 bg-white px-6 md:px-8 flex items-center justify-between sticky top-0 z-40">
        
        {/* Left Side: Logo & Syllabus label & Hamburger */}
        <div className="flex items-center gap-4">
          <button
            id="btn-toggle-sidebar"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 -ml-2 rounded-xl text-[#002B5B] hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
            title={isSidebarOpen ? "Masquer la barre latérale" : "Afficher la barre latérale"}
          >
            <Menu className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span 
            className="font-display font-black text-lg md:text-xl tracking-tight text-[#002B5B] cursor-pointer"
            onClick={() => setCurrentView("parcours")}
          >
            La Plume Africa
          </span>
          <div className="bg-[#F1F5F9] border border-slate-200/80 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest font-mono">
            Syllabus: Grammaire
          </div>
        </div>

        {/* Right Side: XP Pill & Quitter Button */}
        <div className="flex items-center gap-3">
          {/* Gold XP Pill */}
          <div className="flex items-center gap-1.5 bg-[#FFFCE8] border border-[#FFEB85] text-[#A67C00] px-3.5 py-1.5 rounded-full text-xs font-extrabold">
            <div className="w-4.5 h-4.5 rounded-full bg-[#FFD214] flex items-center justify-center text-white shrink-0">
              <Star className="w-2.5 h-2.5 fill-white text-[#FFD214]" />
            </div>
            <span>{userXP} XP</span>
          </div>

          {/* Quitter Button */}
          <button
            id="btn-quit-lesson"
            onClick={() => setCurrentView("parcours")}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-extrabold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            <span>Quitter</span>
          </button>
        </div>

      </header>

      {/* 2. Main 3-Column Layout */}
      <div className="flex-1 flex flex-col md:flex-row md:h-[calc(100vh-4rem)] md:overflow-hidden">
        
        {/* ================= LEFT SIDEBAR (Module structure) ================= */}
        <aside className={`border-r border-slate-100 flex flex-col justify-between shrink-0 bg-[#fcfcfd] transition-all duration-300 ease-in-out origin-left md:overflow-y-auto md:h-full ${
          isSidebarOpen 
            ? "w-full md:w-64 p-6 opacity-100" 
            : "w-0 p-0 opacity-0 overflow-hidden border-r-0 pointer-events-none"
        }`}>
          <div>
            <span className="text-[10px] font-mono font-black text-amber-500 tracking-widest uppercase block mb-1">
              STRUCTURE DU MODULE
            </span>
            <h2 className="text-sm font-black text-[#002B5B] mb-6">
              Module 1 : Fondations
            </h2>

            {/* Steps interactive checklist */}
            <div className="space-y-3">
              {steps.map((s) => {
                const StepIcon = s.icon;
                const isActive = activeStep === s.id;
                const isCompleted = s.id < activeStep;

                // Dynamic card styles
                let cardClass = "bg-white border-slate-100 hover:bg-slate-50";
                let textClass = "text-slate-700";
                let statusClass = "text-slate-400";
                let iconWrapperClass = "bg-slate-100 text-slate-400";
                let showYellowDot = false;

                if (isActive) {
                  showYellowDot = true;
                  if (s.id === 2) {
                    // Dark navy theme from Screenshot 2
                    cardClass = "bg-[#0B2545] border-transparent shadow-md";
                    textClass = "text-white font-black";
                    statusClass = "text-slate-300 font-bold";
                    iconWrapperClass = "bg-[#134074] text-white";
                  } else {
                    // Yellow/gold theme from Screenshot 1
                    cardClass = "bg-[#FFFCE8] border-[#FFEB85] shadow-xs";
                    textClass = "text-[#002B5B] font-black";
                    statusClass = "text-[#A67C00] font-bold";
                    iconWrapperClass = "bg-[#FFD214]/15 text-[#A67C00]";
                  }
                } else if (isCompleted) {
                  cardClass = "bg-white border-slate-100 hover:bg-slate-50";
                  textClass = "text-[#002B5B] font-black";
                  statusClass = "text-slate-400 font-bold";
                  iconWrapperClass = "bg-slate-900 text-white"; // dark badge with white checkmark
                }

                return (
                  <button
                    key={s.id}
                    id={`lesson-step-btn-${s.id}`}
                    onClick={() => setActiveStep(s.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 relative ${cardClass}`}
                  >
                    {/* Active yellow dot on the far right of the card */}
                    {showYellowDot && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FFD214] shadow-xs animate-pulse" />
                    )}

                    {/* Step Icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconWrapperClass}`}>
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <StepIcon className="w-4 h-4 stroke-[2.5]" />
                      )}
                    </div>

                    {/* Step Title & details */}
                    <div className="pr-3 flex-1">
                      <p className={`text-xs ${textClass}`}>
                        {s.title}
                      </p>
                      <p className={`text-[10px] uppercase tracking-wide ${statusClass}`}>
                        {s.status}
                      </p>
                    </div>

                    {/* Quiz tag if present */}
                    {s.hasBadge && (
                      <span className="bg-blue-50 text-[#002B5B] border border-blue-100 text-[8px] font-black px-1.5 py-0.5 rounded uppercase font-mono shrink-0">
                        QUIZ
                      </span>
                    )}

                  </button>
                );
              })}
            </div>
          </div>

          {/* Left Sidebar Footer Progress */}
          <div className="mt-8 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center text-[10px] font-mono font-black text-slate-400 mb-2 uppercase">
              <span>Progression</span>
              <span>{Math.round(((activeStep - 1) / 5) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-blue rounded-full transition-all duration-300" 
                style={{ width: `${((activeStep - 1) / 5) * 100}%` }}
              />
            </div>
          </div>

        </aside>

        {/* ================= MIDDLE WORKSPACE (Lesson Content Reader) ================= */}
        <main className="flex-1 bg-[#FDFDFD] border-r border-slate-100 p-6 md:p-12 overflow-y-auto">
          
          <div className="max-w-2xl mx-auto space-y-8">
            
            {/* Breadcrumb path */}
            <div className="text-[10px] font-mono font-black text-[#FFD214] tracking-widest uppercase">
              LEÇON 1 / CHAPITRE {activeStep} : {activeStep === 1 ? "INTRODUCTION" : activeStep === 4 ? "ÉVALUATION" : "NOTIONS CLÉS"}
            </div>

            {/* Dynamic Step Content view switcher */}
            {activeStep === 1 && (
              <div className="space-y-6">
                
                {/* Large Display Title */}
                <h1 className="font-display font-black text-3xl md:text-4xl text-[#002B5B] leading-tight tracking-tight">
                  Les Fondations du Système d’Articles
                </h1>

                {/* Body paragraph copy blocks matching screenshot */}
                <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
                  Pour réussir les épreuves écrites et orales du WAEC, la maîtrise absolue des articles est votre premier rempart. En français, chaque nom possède un genre (masculin ou féminin) et un nombre (singulier ou pluriel). L'article est le premier indicateur qui donne cette information cruciale au lecteur.
                </p>

                <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
                  Dans cette introduction, nous allons revoir comment identifier rapidement les pièges classiques posés dans les sections de compréhension de texte. Lisez attentivement les règles ci-dessous puis visionnez la vidéo explicative avant de passer aux exercices pratiques du chapitre suivant.
                </p>

                {/* Golden Tip Box banner */}
                <div className="bg-[#FFFCE8] border-l-4 border-[#FFD214] p-5 rounded-r-2xl shadow-3xs flex items-start gap-4">
                  <div className="p-2 bg-[#FFD214]/15 text-[#A67C00] rounded-xl shrink-0 mt-0.5">
                    <Lightbulb className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono font-black text-[#A67C00] tracking-widest uppercase">
                      RÈGLE D'OR POUR LE WAEC
                    </h4>
                    <p className="text-slate-700 text-xs font-semibold mt-1.5 leading-relaxed">
                      Attention à l'élision (l') devant les mots commençant par une voyelle ou un H muet. C'est l'une des sources d'erreurs les plus fréquentes dans la partie grammaire de l'examen.
                    </p>
                  </div>
                </div>

                {/* Video Player Segment */}
                <div className="space-y-3 pt-4">
                  <h4 className="text-[10px] font-mono font-black text-slate-400 tracking-widest uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue inline-block" />
                    Capsule Vidéo : Explication Pédagogique
                  </h4>

                  {/* Dark compliance video preview frame */}
                  <div className="bg-[#0B1325] rounded-3xl overflow-hidden aspect-video relative border border-slate-800 shadow-md">
                    <video
                      controls
                      preload="metadata"
                      src={lessonIntroVideo}
                      className="w-full h-full object-cover"
                      title="Capsule 1.1 : Les Secrets des Articles"
                    />
                  </div>
                </div>

              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                {/* 1. Breadcrumb & Title */}
                <h1 className="font-display font-black text-2xl md:text-3xl text-[#002B5B] leading-tight tracking-tight">
                  L’Usage Précis des Articles Définis
                </h1>
                
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  Les articles définis <strong>(le, la, l', les)</strong> s'utilisent pour désigner un être ou une chose précise, déjà connue des interlocuteurs ou identifiée de façon unique dans le contexte textuel. À l'épreuve du WAEC, la distinction de ces éléments influence directement votre note de structure syntaxique.
                </p>

                {/* 2. RÈGLES D'ACCORD FONDAMENTALES */}
                <div className="border border-slate-100 rounded-3xl p-6 bg-white space-y-4 shadow-3xs">
                  <h3 className="text-xs font-mono font-black text-[#002B5B] tracking-widest uppercase flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#002B5B]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.25z"/>
                    </svg>
                    RÈGLES D'ACCORD FONDAMENTALES
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Masculin Singulier (Le) */}
                    <div className="bg-[#fcfcfd] border border-slate-100 p-4 rounded-2xl">
                      <p className="text-xs font-black text-[#002B5B] uppercase tracking-wide">
                        Masculin Singulier (Le)
                      </p>
                      <p className="text-slate-500 text-[11px] font-semibold mt-1">
                        Devant une consonne : <span className="font-black text-slate-800">Le livre.</span>
                      </p>
                    </div>

                    {/* Féminin Singulier (La) */}
                    <div className="bg-[#fcfcfd] border border-slate-100 p-4 rounded-2xl">
                      <p className="text-xs font-black text-[#002B5B] uppercase tracking-wide">
                        Féminin Singulier (La)
                      </p>
                      <p className="text-slate-500 text-[11px] font-semibold mt-1">
                        Devant une consonne : <span className="font-black text-slate-800">La plume.</span>
                      </p>
                    </div>

                    {/* Élision Majeure (L') */}
                    <div className="bg-[#fcfcfd] border border-slate-100 p-4 rounded-2xl">
                      <p className="text-xs font-black text-[#002B5B] uppercase tracking-wide">
                        Élision Majeure (L')
                      </p>
                      <p className="text-slate-500 text-[11px] font-semibold mt-1">
                        Devant une voyelle : <span className="font-black text-slate-800">L'étudiant.</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. EXERCICE DE VALIDATION RAPIDE (Interactive 11-Question Quiz) */}
                <div className="border border-slate-150 rounded-3xl p-6 bg-white space-y-5 shadow-xs relative overflow-hidden">
                  
                  {/* Decorative background accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(255,210,20,0.06),transparent)] pointer-events-none" />

                  {/* Header info bar */}
                  <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#FFFCE8] border border-[#FFEB85] flex items-center justify-center text-[#A67C00]">
                        <ClipboardList className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div>
                        <h3 className="text-xs font-mono font-black text-[#002B5B] tracking-wider uppercase">
                          EXERCICE DE VALIDATION RAPIDE
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                          Chapitre 2 : Les Articles Définis
                        </p>
                      </div>
                    </div>
                    <span className="bg-[#FFFCE8] text-[#A67C00] border border-[#FFEB85] text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider font-mono">
                      AUTO-ÉVALUATION SANS CHRONO
                    </span>
                  </div>

                  {/* Quiz State Machine Rendering */}
                  {!quizCompleted ? (
                    /* ACTIVE QUIZ (Not Completed) */
                    <div className="space-y-5 py-1">
                      
                      {/* Active Quiz HUD: Question Index & Progress Bar */}
                      <div className="flex items-center justify-between gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#002B5B]">
                            Question {currentQuizIndex + 1} / 11
                          </span>
                        </div>

                        {/* Middle mini progress indicators */}
                        <div className="flex-1 max-w-md h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#002B5B] rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuizIndex + 1) / 11) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Question Text */}
                      <div className="space-y-1">
                        <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">
                          Consigne : Complétez la phrase suivante
                        </p>
                        <p className="text-sm font-black text-[#002B5B] leading-relaxed bg-slate-50/40 p-4 rounded-2xl border border-dashed border-slate-200/80">
                          {QUIZ_QUESTIONS[currentQuizIndex].question}
                        </p>
                      </div>

                      {/* Four Multiple-Choice Options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {QUIZ_QUESTIONS[currentQuizIndex].options.map((opt) => {
                          const isSelected = quizSelectedOption === opt.key;
                          const isCorrectKey = opt.key === QUIZ_QUESTIONS[currentQuizIndex].correctKey;
                          
                          // Style states based on submission
                          let buttonStyle = "bg-white border-slate-200 hover:bg-slate-50";
                          let optionCircleStyle = "border-slate-300 bg-white";
                          let textStyle = "text-slate-700";

                          if (quizIsAnswerSubmitted) {
                            if (isSelected) {
                              if (isCorrectKey) {
                                buttonStyle = "bg-emerald-50/70 border-emerald-400 ring-1 ring-emerald-400";
                                optionCircleStyle = "border-emerald-500 bg-emerald-500 text-white";
                                textStyle = "text-emerald-900 font-extrabold";
                              } else {
                                buttonStyle = "bg-rose-50/70 border-rose-300 ring-1 ring-rose-300";
                                optionCircleStyle = "border-rose-500 bg-rose-500 text-white";
                                textStyle = "text-rose-900 font-extrabold";
                              }
                            } else {
                              if (isCorrectKey) {
                                // Highlight the correct option subtly to show them the correct answer
                                buttonStyle = "bg-emerald-50/30 border-emerald-200";
                                optionCircleStyle = "border-emerald-300 bg-emerald-50";
                                textStyle = "text-emerald-800 font-bold";
                              } else {
                                buttonStyle = "bg-white border-slate-100 opacity-50 cursor-not-allowed";
                                textStyle = "text-slate-400";
                              }
                            }
                          } else {
                            if (isSelected) {
                              buttonStyle = "bg-[#FFFDEE] border-[#FFEB85] ring-2 ring-[#FFD214]/25";
                              optionCircleStyle = "border-[#FFD214] bg-[#FFD214]";
                              textStyle = "text-[#002B5B] font-black";
                            }
                          }

                          return (
                            <button
                              key={opt.key}
                              disabled={quizIsAnswerSubmitted}
                              onClick={() => {
                                if (!quizIsAnswerSubmitted) {
                                  setQuizSelectedOption(opt.key);
                                }
                              }}
                              className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                                quizIsAnswerSubmitted ? "cursor-default" : "cursor-pointer"
                              } ${buttonStyle}`}
                            >
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-mono font-black ${optionCircleStyle}`}>
                                {quizIsAnswerSubmitted && isCorrectKey ? (
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : quizIsAnswerSubmitted && isSelected && !isCorrectKey ? (
                                  <span className="text-white">×</span>
                                ) : (
                                  isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                              </div>
                              <span className={`text-xs font-bold ${textStyle}`}>
                                {opt.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Answer Feedback / Explanations */}
                      {quizIsAnswerSubmitted && (
                        <div className={`p-4 rounded-2xl flex items-start gap-3 border transition-all animate-fadeIn ${
                          quizSelectedOption === QUIZ_QUESTIONS[currentQuizIndex].correctKey
                            ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                            : "bg-rose-50 border-rose-100 text-rose-800"
                        }`}>
                          <div className="mt-0.5 shrink-0">
                            {quizSelectedOption === QUIZ_QUESTIONS[currentQuizIndex].correctKey ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-current" />
                            ) : (
                              <ShieldAlert className="w-5 h-5 text-rose-500 fill-current" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-black">
                              {quizSelectedOption === QUIZ_QUESTIONS[currentQuizIndex].correctKey 
                                ? "Excellent ! Réponse Correcte" 
                                : "Correction d'Usage Pédagogique"
                              }
                            </p>
                            <p className="text-[11px] font-semibold mt-1 leading-relaxed opacity-90">
                              {quizSelectedOption === QUIZ_QUESTIONS[currentQuizIndex].correctKey 
                                ? QUIZ_QUESTIONS[currentQuizIndex].explanationCorrect 
                                : QUIZ_QUESTIONS[currentQuizIndex].explanationIncorrect
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Action Controllers */}
                      <div className="flex justify-end pt-1">
                        {!quizIsAnswerSubmitted ? (
                          <button
                            disabled={!quizSelectedOption}
                            onClick={() => {
                              if (!quizSelectedOption) return;
                              setQuizIsAnswerSubmitted(true);
                              const isCorrect = quizSelectedOption === QUIZ_QUESTIONS[currentQuizIndex].correctKey;
                              if (isCorrect) {
                                setQuizScore((prev) => prev + 1);
                                onGainXP(5);
                              }
                              // Save response
                              setQuizAnswers((prev) => ({
                                ...prev,
                                [currentQuizIndex]: quizSelectedOption
                              }));
                            }}
                            className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                              !quizSelectedOption
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-[#002B5B] hover:bg-blue-800 text-white shadow-xs"
                            }`}
                          >
                            Valider ma réponse
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (currentQuizIndex < 10) {
                                setCurrentQuizIndex((prev) => prev + 1);
                                setQuizSelectedOption(null);
                                setQuizIsAnswerSubmitted(false);
                              } else {
                                setQuizCompleted(true);
                              }
                            }}
                            className="bg-[#002B5B] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-xs cursor-pointer flex items-center gap-1.5"
                          >
                            <span>
                              {currentQuizIndex < 10 ? "Question suivante" : "Voir les résultats"}
                            </span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                    </div>
                  ) : (
                    /* 3. QUIZ RESULTS SUMMARY */
                    <div className="space-y-6 py-1 text-center sm:text-left">
                      
                      <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 p-5 rounded-3xl border border-slate-100">
                        <div className="w-16 h-16 rounded-2xl bg-[#FFFCE8] border border-[#FFEB85] flex items-center justify-center text-[#A67C00] shrink-0">
                          <Award className="w-8 h-8 stroke-[2]" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <h4 className="font-display font-black text-lg text-[#002B5B]">
                            Exercice de Validation Terminé !
                          </h4>
                          <p className="text-slate-600 text-xs font-semibold">
                            {quizScore >= 9 
                              ? "Félicitations ! Vous avez atteint l'objectif requis pour ce chapitre."
                              : "Bonne tentative ! Prenez le temps d'analyser vos erreurs pour progresser."
                            }
                          </p>
                        </div>
                        <div className="text-center bg-[#002B5B] text-white px-5 py-3 rounded-2xl shrink-0">
                          <p className="text-[10px] font-mono font-black text-slate-300 uppercase tracking-wider">SCORE FINAL</p>
                          <p className="text-2xl font-display font-black mt-0.5">{quizScore} / 11</p>
                        </div>
                      </div>

                      {/* Performance gauge metrics */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-[#fcfcfd] border border-slate-100 p-4 rounded-2xl text-left">
                          <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wide">Taux de réussite</span>
                          <p className="text-lg font-display font-black text-[#002B5B] mt-1">
                            {Math.round((quizScore / 11) * 100)}%
                          </p>
                        </div>
                        <div className="bg-[#fcfcfd] border border-slate-100 p-4 rounded-2xl text-left">
                          <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wide">Seuil de validation</span>
                          <p className="text-lg font-display font-black text-slate-700 mt-1">80% (9/11)</p>
                        </div>
                        <div className="bg-[#FFFCE8] border border-[#FFEB85] p-4 rounded-2xl text-left">
                          <span className="text-[10px] font-mono font-black text-[#A67C00] uppercase tracking-wide">Points XP gagnés</span>
                          <p className="text-lg font-display font-black text-[#A67C00] mt-1">
                            +{quizScore * 5} XP
                          </p>
                        </div>
                      </div>

                      {/* Action buttons allowing either restart or skip to next chapter */}
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            setQuizStarted(true);
                            setQuizCompleted(false);
                            setCurrentQuizIndex(0);
                            setQuizSelectedOption(null);
                            setQuizIsAnswerSubmitted(false);
                            setQuizAnswers({});
                            setQuizScore(0);
                          }}
                          className="w-full sm:w-auto bg-white hover:bg-slate-50 text-[#002B5B] border border-slate-200 font-extrabold text-xs uppercase tracking-wider px-5 py-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 15.89M9 11l3-3m0 0l3 3m-3-3v8" />
                          </svg>
                          <span>Recommencer le test</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveStep(3); // Direct proceed to next chapter "Les Articles Indéfinis"
                          }}
                          className="w-full sm:w-auto bg-[#002B5B] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>Passer au chapitre 3</span>
                          <ChevronRight className="w-4.5 h-4.5" />
                        </button>
                      </div>

                    </div>
                  )}

                </div>

                {/* 4. CAPSULE VIDÉO SYNTAXE : L'ÉLISION */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-mono font-black text-slate-400 tracking-widest uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue inline-block" />
                    CAPSULE VIDÉO SYNTAXE : L'ÉLISION
                  </h4>
                  <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                    Regardez cette courte capsule pour revoir la règle d'élision si vous hésitez sur l'exercice.
                  </p>

                  {/* Dark compliance video preview frame */}
                  <div className="bg-[#0B1325] rounded-3xl overflow-hidden aspect-video relative flex flex-col justify-between p-6 group border border-slate-800 shadow-md">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,210,20,0.08),transparent)] pointer-events-none" />

                    <div className="text-right z-10">
                      <span className="bg-white/10 text-white text-[10px] font-mono font-black px-2.5 py-1 rounded-full backdrop-blur-xs">
                        HD 1080p
                      </span>
                    </div>

                    {/* Central Play Controller Button */}
                    <div className="flex justify-center items-center z-10">
                      <button 
                        onClick={() => setIsCapsule12Playing(!isCapsule12Playing)}
                        className="w-16 h-16 rounded-full bg-white text-[#0B1325] hover:bg-slate-100 flex items-center justify-center shadow-lg transform hover:scale-110 active:scale-95 transition-all cursor-pointer"
                        title={isCapsule12Playing ? "Pause" : "Play video lesson"}
                      >
                        {isCapsule12Playing ? (
                          <div className="flex gap-1.5 justify-center items-center">
                            <span className="w-1.5 h-5 bg-[#0B1325] rounded-full inline-block animate-pulse" />
                            <span className="w-1.5 h-5 bg-[#0B1325] rounded-full inline-block animate-pulse" style={{ animationDelay: "0.2s" }} />
                          </div>
                        ) : (
                          <Play className="w-6 h-6 fill-current ml-1" />
                        )}
                      </button>
                    </div>

                    {/* Player Control Bar HUD */}
                    <div className="z-10 w-full bg-black/40 backdrop-blur-xs p-3 rounded-2xl flex items-center justify-between border border-white/5">
                      <div className="flex items-center gap-2.5 text-xs font-bold text-white">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block animate-pulse" />
                        <span>EN LECTURE : CAPSULE 1.2</span>
                      </div>
                      
                      {/* Video dynamic slider bar if playing */}
                      {isCapsule12Playing && (
                        <div className="flex-1 mx-6 h-1 bg-white/20 rounded-full overflow-hidden hidden sm:block">
                          <div className="h-full bg-[#FFD214]" style={{ width: `${capsule12Progress}%` }} />
                        </div>
                      )}

                      <span className="text-[10px] font-mono text-slate-300 font-bold bg-white/5 px-2 py-0.5 rounded">
                        03:15
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-6">
                <h1 className="font-display font-black text-2xl md:text-3xl text-[#002B5B]">
                  3. Les Articles Indéfinis (Un, Une, Des)
                </h1>
                
                <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
                  Les articles indéfinis s'emploient devant des êtres ou des choses non spécifiés, ou dont on parle pour la première fois. Par exemple: 'Un élève de la cohorte', 'Une leçon de grammaire'.
                </p>

                {/* Interactive Flashcard segment */}
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl mt-4">
                  <span className="text-[9px] font-mono font-black text-[#002B5B] uppercase tracking-wider block mb-2">
                    EXEMPLE PRATIQUE
                  </span>
                  <p className="text-lg font-black text-[#002B5B] font-display italic">
                    « J'ai vu un étudiant réviser avec sa Plume ce matin. »
                  </p>
                  <p className="text-slate-400 text-xs font-semibold mt-2 leading-relaxed">
                    Notez ici l'élision de l'article devant le mot commençant par une voyelle ou un 'h' muet, pour conserver l'harmonie sonore à la lecture.
                  </p>
                </div>
              </div>
            )}

            {/* Application Mini Quiz inside step 4 */}
            {activeStep === 4 && (
              <div className="space-y-6">
                <h1 className="font-display font-black text-2xl md:text-3xl text-[#002B5B]">
                  Exercice d'Application (Vérification immédiate)
                </h1>
                <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                  Testez vos connaissances acquises sur le chapitre des articles définis et indéfinis avant la synthèse finale.
                </p>

                <div className="border border-slate-100 rounded-3xl p-6 bg-slate-50/50 space-y-4">
                  <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">
                    QUESTION UNIQUE DE VALIDATION
                  </span>
                  <p className="text-sm font-black text-[#002B5B]">
                    Dans la phrase : "Il a acheté _____ enveloppes bleues pour envoyer la lettre", quel article convient ?
                  </p>
                  
                  <div className="space-y-2">
                    {["un", "les", "des"].map((opt, i) => (
                      <button
                        key={i}
                        className="w-full text-left p-3.5 bg-white border border-slate-200/60 rounded-xl text-xs font-black text-[#002B5B] hover:border-brand-blue transition-all"
                        onClick={() => {
                          alert(opt === "des" ? "Correct! +15 XP" : "Oups! Réessayez.");
                          if (opt === "des") onGainXP(15);
                        }}
                      >
                        {i + 1}. {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5 Finale summary */}
            {activeStep === 5 && (
              <div className="space-y-6 text-center py-8">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto border border-emerald-100 shadow-sm">
                  <Award className="w-8 h-8" />
                </div>
                <h1 className="font-display font-black text-2xl text-[#002B5B]">
                  Félicitations! Chapitre complété.
                </h1>
                <p className="text-slate-500 text-xs md:text-sm max-w-sm mx-auto leading-relaxed font-medium">
                  Vous avez validé l'intégralité du module d'introduction. Continuez ainsi pour maîtriser l'ensemble du syllabus et remporter l'épreuve écrite du WAEC !
                </p>
              </div>
            )}

            {/* Bottom standard navigation controls */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-12">
              <button
                id="btn-prev-lesson-step"
                onClick={handlePrevStep}
                disabled={activeStep === 1}
                className={`flex items-center gap-1.5 text-xs font-extrabold tracking-wider uppercase px-4 py-3 rounded-xl border transition-all ${
                  activeStep === 1 
                    ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" 
                    : "bg-white border-slate-200 text-[#002B5B] hover:bg-slate-50 cursor-pointer"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>

              <span className="text-[10px] font-mono font-black text-slate-400 tracking-widest uppercase">
                CHAPITRES D'INTRODUCTION
              </span>

              <button
                id="btn-next-lesson-step"
                onClick={handleNextStep}
                className="flex items-center gap-1.5 bg-[#002B5B] hover:bg-blue-800 text-white text-xs font-black tracking-wider uppercase px-5 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <span>{activeStep === 5 ? "Terminer" : "Suivant"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </main>

        {/* ================= RIGHT SIDEBAR (Focus session clock status) ================= */}
        <aside className="w-full md:w-64 p-6 flex flex-col gap-6 shrink-0 bg-white md:overflow-y-auto md:h-full">
          
          {/* Circular Countdown Tracker matching screenshot */}
          <div className="bg-[#fcfcfd] border border-slate-100 rounded-3xl p-6 flex flex-col items-center justify-between text-center min-h-[300px]">
            
            <div className="w-full">
              {/* Green status badge pill */}
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-100 inline-flex items-center gap-1.5 font-sans justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                FOCUS ACTIF
              </span>
              
              <h4 className="text-[#002B5B] font-display font-black text-base mt-3">
                Temps de Lecture
              </h4>
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed mt-1">
                Demeurez sur cette page pour valider l'étape et récolter vos points d'expérience.
              </p>
            </div>

            {/* TIMER CIRCLE SVG PATH */}
            <div className="relative w-36 h-36 flex items-center justify-center my-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="72" 
                  cy="72" 
                  r="54" 
                  stroke="#F1F5F9" 
                  strokeWidth="6" 
                  fill="transparent" 
                />
                <circle 
                  cx="72" 
                  cy="72" 
                  r="54" 
                  stroke="#FFD214" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              
              <div className="absolute flex flex-col items-center">
                <span className="text-[10px] font-mono font-black text-slate-400 tracking-wider">FOCUS</span>
                <span className="text-2xl font-mono font-black text-slate-800 leading-none my-1">
                  {formatTime(secondsLeft)}
                </span>
                {/* Pending XP award pill */}
                <span className="bg-[#FFFCE8] text-[#A67C00] border border-[#FFEB85] text-[8px] font-black px-2 py-0.5 rounded-full mt-0.5">
                  +25 XP en attente
                </span>
              </div>
            </div>

          </div>

          {/* Bottom details card box */}
          <div className="bg-slate-50 border border-slate-150/60 rounded-3xl p-5 space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
              <span>ÉTAT</span>
              <span className="font-mono text-slate-700 font-black">Étape {activeStep} sur 5</span>
            </div>
            
            <div className="border-t border-slate-200/60 pt-2.5 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400">Objectif de session</span>
              <span className="text-emerald-600 text-[10px] font-black">100% Concentration</span>
            </div>

            <div className="border-t border-slate-200/60 pt-2.5 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400">Assimilation estimée</span>
              <span className="text-[#002B5B] text-[10px] font-black">82%</span>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
