/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  GraduationCap, Star, Play, Lock, Settings, Bell, ChevronRight, Sparkles,
  Mic, Trophy, BookOpen, Compass, Award, Activity, Heart, ArrowLeft, Check,
  Volume2, CheckCircle2, MessageSquare, Flag, Mail, Newspaper, FileEdit, X, Shield, Menu
} from "lucide-react";

interface ParcoursViewProps {
  userXP: number;
  userStreak: number;
  setCurrentView: (view: string) => void;
  isPremium?: boolean;
  defaultTab?: "roadmap" | "stats";
  hideSidebar?: boolean;
}

interface NodeInfo {
  id: string;
  title: string;
  subtitle?: string;
  score: string;
  status: "Complété" | "En cours" | "Déverrouillé" | "Locked";
  description: string;
  type: "start" | "lesson" | "checkpoint" | "project" | "graduation";
  icon: React.ComponentType<any>;
}

export default function ParcoursView({ 
  userXP, 
  userStreak, 
  setCurrentView,
  isPremium = false,
  defaultTab = "roadmap",
  hideSidebar = false
}: ParcoursViewProps) {
  const [localXP, setLocalXP] = useState(userXP);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!hideSidebar);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
    if (hideSidebar) {
      setIsSidebarOpen(false);
    }
  }, [hideSidebar]);
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState<"roadmap" | "stats">(defaultTab);
  const [attempts, setAttempts] = useState<any[]>([]);

  // Seed baseline attempts if empty
  useEffect(() => {
    const stored = localStorage.getItem("blitz_attempts");
    if (stored) {
      setAttempts(JSON.parse(stored));
    } else {
      const initialAttempts = [
        {
          id: "seed_1",
          date: "12 Juin 2026, 14:15",
          score: 58,
          grade: "D7 (Passable)",
          sectionA: 60,
          sectionB: 50,
          sectionC: 64,
          essayPrompt: "Lettre Amicale",
          timeSpent: { total: "01:45:12" }
        },
        {
          id: "seed_2",
          date: "25 Juin 2026, 09:30",
          score: 71,
          grade: "B2 (Très Bien)",
          sectionA: 80,
          sectionB: 70,
          sectionC: 63,
          essayPrompt: "Discours Argumentatif",
          timeSpent: { total: "02:10:05" }
        },
        {
          id: "seed_3",
          date: "04 Juillet 2026, 11:00",
          score: 83,
          grade: "A1 (Excellent)",
          sectionA: 100,
          sectionB: 80,
          sectionC: 69,
          essayPrompt: "Lettre Amicale",
          timeSpent: { total: "02:02:40" }
        }
      ];
      localStorage.setItem("blitz_attempts", JSON.stringify(initialAttempts));
      setAttempts(initialAttempts);
    }
  }, []);
  
  // Interactive Lesson simulation state
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lessonStep, setLessonStep] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<"idle" | "correct" | "incorrect">("idle");

  const activeNodeRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active node (Leçon 12) on mount
  useEffect(() => {
    if (activeNodeRef.current) {
      activeNodeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, []);

  // Sidebar navigation options
  const sidebarItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: Compass },
    { id: "parcours", label: "Parcours", icon: Award, active: true },
    { id: "courses", label: "Mes Cours", icon: BookOpen },
    { id: "blitz", label: "Le Blitz", icon: Play },
    { id: "leaderboard", label: "Classement", icon: Trophy },
    { id: "progression", label: "Ma Progression", icon: Activity },
    { id: "badges", label: "Mes Badges", icon: Star },
    { id: "certificate", label: "Certificat", icon: Award },
  ];

  // List of all nodes along the path
  const nodes: NodeInfo[] = [
    {
      id: "start",
      title: "DÉBUT",
      subtitle: "Commencement du parcours",
      score: "",
      status: "Complété",
      description: "Votre point de départ vers l'excellence en français et la réussite absolue de votre examen WAEC.",
      type: "start",
      icon: Flag
    },
    // SEMAINE 1
    {
      id: "l1",
      title: "Leçon 1: Syntaxe",
      score: "100%",
      status: "En cours",
      description: "Apprenez les bases de la structure des phrases en français et évitez les erreurs d'inversion courantes.",
      type: "lesson",
      icon: Play
    },
    {
      id: "l2",
      title: "Leçon 2: Ponctuation",
      score: "92%",
      status: "Complété",
      description: "Maîtrisez l'usage délicat des virgules, des points-virgules et des points d'exclamation pour structurer vos écrits.",
      type: "lesson",
      icon: Star
    },
    {
      id: "l3",
      title: "Leçon 3: Vocabulaire",
      score: "87%",
      status: "Complété",
      description: "Enrichissez votre lexique avec des synonymes d'élite pour rehausser le niveau académique de vos productions.",
      type: "lesson",
      icon: Star
    },
    {
      id: "cp1",
      title: "CHECKPOINT 1",
      score: "Validé",
      status: "Complété",
      description: "Vérification globale des notions de grammaire et d'orthographe de la première semaine.",
      type: "checkpoint",
      icon: CheckCircle2
    },
    {
      id: "p1",
      title: "Projet: La Lettre",
      score: "100%",
      status: "Complété",
      description: "Rédigez une lettre formelle respectant scrupuleusement les formules de politesse et les codes de correspondance française.",
      type: "project",
      icon: Mail
    },
    // SEMAINE 2
    {
      id: "l4",
      title: "Leçon 4: Grammaire avancée",
      score: "95%",
      status: "Complété",
      description: "Comprenez les règles d'accord complexes des participes passés et l'emploi du subjonctif présent.",
      type: "lesson",
      icon: Star
    },
    {
      id: "l5",
      title: "Leçon 5: Faux amis",
      score: "88%",
      status: "Complété",
      description: "Identifiez et évitez les pièges de traduction et d'interprétation les plus fréquents.",
      type: "lesson",
      icon: Star
    },
    {
      id: "l6",
      title: "Leçon 6: Registres de langue",
      score: "91%",
      status: "Complété",
      description: "Sachez différencier et employer à bon escient les langages soutenu, courant et familier selon les contextes.",
      type: "lesson",
      icon: Star
    },
    {
      id: "l7",
      title: "Leçon 7: Idiotismes",
      score: "94%",
      status: "Complété",
      description: "Intégrez des expressions idiomatiques typiquement françaises pour donner du naturel et de la couleur à votre écriture.",
      type: "lesson",
      icon: Star
    },
    {
      id: "cp2",
      title: "CHECKPOINT 2",
      score: "Validé",
      status: "Complété",
      description: "Évaluation sur la traduction et l'analyse syntaxique bidirectionnelle.",
      type: "checkpoint",
      icon: CheckCircle2
    },
    {
      id: "p2",
      title: "Projet: La Traduction",
      score: "90%",
      status: "Complété",
      description: "Traduisez un article d'actualité économique ou culturel du français vers l'anglais avec fidélité et rigueur.",
      type: "project",
      icon: Newspaper
    },
    // SEMAINE 3
    {
      id: "l8",
      title: "Leçon 8: Rhétorique",
      score: "92%",
      status: "Complété",
      description: "Apprenez les secrets d'un plan dialectique convaincant (Thèse, Antithèse, Synthèse).",
      type: "lesson",
      icon: Star
    },
    {
      id: "l9",
      title: "Leçon 9: Connecteurs logiques",
      score: "85%",
      status: "Complété",
      description: "Structurez vos transitions logiques (cependant, néanmoins, par conséquent) pour rendre vos argumentations limpides.",
      type: "lesson",
      icon: Star
    },
    {
      id: "l10",
      title: "Leçon 10: Réfutation",
      score: "89%",
      status: "Complété",
      description: "Apprenez l'art de déconstruire poliment et efficacement les objections d'un opposant virtuel.",
      type: "lesson",
      icon: Star
    },
    {
      id: "cp3",
      title: "CHECKPOINT 3",
      score: "Validé",
      status: "Complété",
      description: "Examen blanc d'argumentation écrite chronométré de 45 minutes.",
      type: "checkpoint",
      icon: CheckCircle2
    },
    {
      id: "p3",
      title: "Projet: Le Débat",
      score: "94%",
      status: "Complété",
      description: "Rédigez la tribune d'un grand débat de société, évaluée par notre IA sur la force argumentative et la structure.",
      type: "project",
      icon: FileEdit
    },
    // SEMAINE 4
    {
      id: "l11",
      title: "Leçon 11: Phonétique",
      score: "90%",
      status: "Complété",
      description: "Perfectionnez votre diction, votre articulation et le rythme de vos liaisons à l'oral.",
      type: "lesson",
      icon: Star
    },
    {
      id: "l12",
      title: "Leçon 12: Métaphores",
      score: "85%",
      status: "Complété",
      description: "Apprenez à enrichir votre expression écrite avec des figures de style complexes pour impressionner vos examinateurs.",
      type: "lesson",
      icon: Star
    },
    {
      id: "l13",
      title: "Leçon 13: Improvisation",
      score: "Pas encore noté",
      status: "Déverrouillé",
      description: "Maîtrisez l'improvisation sur des thèmes inattendus de l'oral du WAEC.",
      type: "lesson",
      icon: Star
    },
    {
      id: "cp4",
      title: "CHECKPOINT FINAL",
      score: "",
      status: "Locked",
      description: "Simulation complète des épreuves orales et écrites du baccalauréat.",
      type: "checkpoint",
      icon: CheckCircle2
    },
    {
      id: "p4",
      title: "Projet: L'Oral",
      score: "",
      status: "En cours",
      description: "Présentez un exposé de 5 minutes devant notre jury vocal IA et recevez une note globale de fluidité.",
      type: "project",
      icon: Mic
    },
    {
      id: "graduation",
      title: "REMISE DES DIPLÔMES",
      score: "",
      status: "Locked",
      description: "Félicitations! Vous avez terminé l'intégralité du bootcamp d'excellence de La Plume.",
      type: "graduation",
      icon: GraduationCap
    }
  ];

  const handleNodeClick = (node: NodeInfo) => {
    setSelectedNode(node);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  // Lesson interactive flow questions
  const quizQuestions = {
    audioText: "Bonjour, cher élève! Comment décririez-vous l'impact du débat dans la démocratie?",
    options: [
      "Le débat favorise la confrontation pacifique des idées et enrichit l'opinion publique.",
      "Le débat empêche de prendre des décisions rapides et sème la discorde.",
      "Le débat n'a aucun rôle significatif dans un gouvernement moderne."
    ],
    correctIndex: 0,
    explanation: "Excellent! Un débat bien mené est la pierre angulaire d'un échange constructif, permettant à chacun de s'exprimer de manière respectueuse."
  };

  const startLesson = () => {
    setShowPopup(false);
    setLessonStep(1);
    setSelectedAnswer(null);
    setAnswerStatus("idle");
    setShowLessonModal(true);
  };

  const handleSelectAnswer = (idx: number) => {
    if (answerStatus !== "idle") return;
    setSelectedAnswer(idx);
    if (idx === quizQuestions.correctIndex) {
      setAnswerStatus("correct");
      setLocalXP(prev => prev + 50);
    } else {
      setAnswerStatus("incorrect");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#fcfcfd] text-slate-800 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-35 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1. Side Navigation Rail */}
      <aside className={`border-r border-slate-100 bg-white flex flex-col justify-between shrink-0 fixed md:sticky left-0 top-0 h-screen z-40 transition-all duration-300 ${
        isSidebarOpen 
          ? "w-64 translate-x-0 opacity-100" 
          : "w-0 -translate-x-full md:translate-x-0 md:opacity-0 md:w-0 overflow-hidden border-r-0 pointer-events-none"
      }`}>
        <div className="p-6">
          {/* Logo with Cap Icon */}
          <div className="flex items-center justify-between mb-8">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setCurrentView("landing")}
            >
              <div className="bg-[#002B5B] p-1.5 rounded-xl text-white group-hover:bg-blue-800 transition-all shadow-md shrink-0">
                <GraduationCap className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-display font-black text-lg tracking-tight text-[#002B5B] block leading-none">
                  La Plume
                </span>
                <span className="text-[9px] uppercase tracking-widest font-mono text-amber-500 font-bold block -mt-0.5">
                  French Prep
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = 
                (item.id === "parcours" && activeTab === "roadmap") || 
                (item.id === "progression" && activeTab === "stats");
              return (
                <button
                  key={item.id}
                  id={`sidebar-item-${item.id}`}
                  onClick={() => {
                    if (item.id === "dashboard") {
                      setCurrentView("dashboard");
                    } else if (item.id === "blitz") {
                      setCurrentView("blitz");
                    } else if (item.id === "exams") {
                      setCurrentView("exams");
                    } else if (item.id === "leaderboard") {
                      setCurrentView("ranking");
                    } else if (item.id === "badges" || item.id === "certificate") {
                      setCurrentView("profile");
                    } else if (item.id === "courses") {
                      setCurrentView("mes-cours");
                    } else if (item.id === "parcours") {
                      setActiveTab("roadmap");
                    } else if (item.id === "progression") {
                      setActiveTab("stats");
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? "bg-blue-50 text-blue-700 border border-blue-100" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : ""}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === "exams" && (
                    <span className="bg-rose-500/15 text-rose-400 text-[8px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm border border-rose-500/25">IA</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Settings */}
        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={() => setCurrentView("dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Paramètres</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        
        {/* Top Header Navigation */}
        <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-100 px-8 py-4 h-16 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer shrink-0"
              title="Menu principal"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="font-display font-black text-lg text-[#002B5B] tracking-tight">
              La Plume Africa
            </span>
            <div className="hidden md:flex items-center bg-amber-50 border border-amber-200 px-3 py-1 rounded-full gap-2">
              <span className="text-amber-700 text-xs font-mono font-black animate-pulse flex items-center gap-1">
                ⚡ {localXP} XP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 text-xs font-bold">
              <button onClick={() => setCurrentView("landing")} className="text-slate-500 hover:text-blue-600 transition-colors">Home</button>
              <button onClick={() => setCurrentView("parcours")} className="text-[#002B5B] border-b-2 border-[#002B5B] pb-1 font-black">Parcours</button>
              <button onClick={() => setCurrentView("plan-selection")} className="text-slate-500 hover:text-blue-600 transition-colors">Pricing</button>
            </nav>

            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 relative cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
              </button>
              
              <div className="w-10 h-10 rounded-full border-2 border-amber-400 p-0.5 shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120"
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Sub-Header Tabs Switcher */}
        <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-3.5 flex flex-wrap gap-4 items-center justify-between shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("roadmap")}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "roadmap"
                  ? "bg-[#002B5B] text-white shadow-md scale-102"
                  : "text-slate-500 hover:text-slate-800 bg-white border border-slate-200"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Syllabus & Carte d'Apprentissage</span>
            </button>

            <button
              onClick={() => setActiveTab("stats")}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "stats"
                  ? "bg-[#002B5B] text-white shadow-md scale-102"
                  : "text-slate-500 hover:text-slate-800 bg-white border border-slate-200"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Mon Parcours (Performance & Stats)</span>
            </button>
          </div>
          
          {activeTab === "stats" && attempts.length > 0 && (
            <div className="text-[10px] font-mono font-bold bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg text-blue-700 flex items-center gap-1.5">
              <Trophy className="w-3 h-3 animate-bounce" />
              <span>{attempts.length} Simulations de Blitz Enregistrées</span>
            </div>
          )}
        </div>

        {/* 3. Main Scrollable Journey Canvas or Performance Dashboard */}
        <main className="flex-1 relative overflow-hidden bg-white flex">
          
          {activeTab === "roadmap" ? (<>
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar h-[calc(100vh-8rem)] relative"
              style={{ 
                backgroundImage: "radial-gradient(#cbd5e1 1.5px, transparent 1.5px)",
                backgroundSize: "40px 40px"
              }}
            >
            {/* Scrollable Map Stage container - 4500px tall to fit all nodes nicely spaced out */}
            <div className="relative w-full max-w-2xl mx-auto py-24 px-8 min-h-[4600px]">
              
              {/* Journey Map SVG for Connecting Path Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                {/* Master Path Line */}
                <line stroke="#e2e8f0" strokeDasharray="8,8" strokeWidth="4" x1="50%" x2="50%" y1="50" y2="4450" />
                {/* Completed Path Line (Up to Leçon 12, approx 3550px) */}
                <line 
                  className="path-completed" 
                  stroke="#002B5B" 
                  strokeWidth="6" 
                  x1="50%" 
                  x2="50%" 
                  y1="50" 
                  y2="3410" 
                  style={{ 
                    filter: "drop-shadow(0 4px 12px rgba(0, 43, 91, 0.15))",
                    strokeDasharray: "10,10"
                  }} 
                />
              </svg>

              {/* Journey Nodes List */}
              <div className="relative z-10 flex flex-col items-center gap-32">
                
                {/* 1. DÉBUT */}
                <div 
                  className="group relative flex flex-col items-center cursor-pointer"
                  onClick={() => handleNodeClick(nodes[0])}
                >
                  <div className="w-16 h-16 bg-[#002B5B] rotate-45 flex items-center justify-center shadow-lg shadow-blue-500/10 transition-transform hover:scale-110">
                    <Flag className="-rotate-45 w-6 h-6 text-white fill-current" />
                  </div>
                  <span className="mt-4 font-black text-sm tracking-widest text-[#002B5B] uppercase">DÉBUT ◇</span>
                </div>

                {/* 2. SEMAINE 1 */}
                <div className="w-full flex flex-col items-center gap-12">
                  <div className="text-center">
                    <h3 className="font-display font-black text-lg text-slate-800">Semaine 1: Fondations</h3>
                    <p className="text-slate-500 text-xs mt-1">L'art de l'expression écrite</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-16">
                    {/* Lesson 1 */}
                    <div 
                      ref={activeNodeRef}
                      className="flex flex-col items-center cursor-pointer relative" 
                      onClick={() => handleNodeClick(nodes[1])}
                    >
                      <div className="relative">
                        {/* Golden pulsing ring effect */}
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping pointer-events-none" style={{ animationDuration: "2s" }} />
                        <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center relative z-10 shadow-lg shadow-blue-500/20 border-4 border-white hover:scale-110 transition-all">
                          <Play className="w-6 h-6 text-white fill-current ml-0.5" />
                        </div>
                      </div>
                      <span className="mt-2 text-xs font-black text-blue-600">Leçon 1 (En cours)</span>
                    </div>
                    {/* Lesson 2 */}
                    <div className="flex flex-col items-center cursor-pointer translate-x-8" onClick={() => handleNodeClick(nodes[2])}>
                      <div className="w-14 h-14 bg-emerald-500 border-4 border-white text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-white fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-semibold text-slate-600">Leçon 2</span>
                    </div>
                    {/* Lesson 3 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[3])}>
                      <div className="w-14 h-14 bg-emerald-500 border-4 border-white text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-white fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-semibold text-slate-600">Leçon 3</span>
                    </div>
                  </div>
                </div>

                {/* 3. CHECKPOINT 1 */}
                <div 
                  className="w-16 h-16 border-4 border-emerald-500 bg-white rounded-full flex items-center justify-center cursor-pointer group transition-transform hover:scale-110 relative shadow-sm"
                  onClick={() => handleNodeClick(nodes[4])}
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <div className="absolute -bottom-8 whitespace-nowrap text-[9px] font-mono text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                    CHECKPOINT 1
                  </div>
                </div>

                {/* 4. PROJET: LA LETTRE */}
                <div 
                  className="relative group flex flex-col items-center cursor-pointer" 
                  onClick={() => handleNodeClick(nodes[5])}
                >
                  <div 
                    className="w-24 h-24 bg-[#002B5B] border-4 border-white text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all" 
                    style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }}
                  >
                    <Mail className="w-9 h-9 text-white fill-current" />
                  </div>
                  <span className="mt-4 font-black text-xs text-[#002B5B] uppercase tracking-wider">✉️ PROJET: LA LETTRE</span>
                </div>

                {/* 5. SEMAINE 2 */}
                <div className="w-full flex flex-col items-center gap-12">
                  <div className="text-center">
                    <h3 className="font-display font-black text-lg text-slate-800">Semaine 2: Analyse & Traduction</h3>
                    <p className="text-slate-500 text-xs mt-1">Naviguer entre les langues</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-12 max-w-md">
                    {/* Lesson 4 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[6])}>
                      <div className="w-14 h-14 bg-emerald-500 border-4 border-white text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-white fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-semibold text-slate-600">Leçon 4</span>
                    </div>
                    {/* Lesson 5 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[7])}>
                      <div className="w-14 h-14 bg-emerald-500 border-4 border-white text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-white fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-semibold text-slate-600">Leçon 5</span>
                    </div>
                    {/* Lesson 6 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[8])}>
                      <div className="w-14 h-14 bg-emerald-500 border-4 border-white text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-white fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-semibold text-slate-600">Leçon 6</span>
                    </div>
                    {/* Lesson 7 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[9])}>
                      <div className="w-14 h-14 bg-emerald-500 border-4 border-white text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-white fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-semibold text-slate-600">Leçon 7</span>
                    </div>
                  </div>
                </div>

                {/* 6. CHECKPOINT 2 */}
                <div 
                  className="w-16 h-16 border-4 border-emerald-500 bg-white rounded-full flex items-center justify-center cursor-pointer group transition-transform hover:scale-110 relative shadow-sm"
                  onClick={() => handleNodeClick(nodes[10])}
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <div className="absolute -bottom-8 whitespace-nowrap text-[9px] font-mono text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                    CHECKPOINT 2
                  </div>
                </div>

                {/* 7. PROJET: LA TRADUCTION */}
                <div 
                  className="relative group flex flex-col items-center cursor-pointer" 
                  onClick={() => handleNodeClick(nodes[11])}
                >
                  <div 
                    className="w-24 h-24 bg-[#002B5B] border-4 border-white text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all" 
                    style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }}
                  >
                    <Newspaper className="w-9 h-9 text-white fill-current" />
                  </div>
                  <span className="mt-4 font-black text-xs text-[#002B5B] uppercase tracking-wider">📰 PROJET: LA TRADUCTION</span>
                </div>

                {/* 8. SEMAINE 3 */}
                <div className="w-full flex flex-col items-center gap-12">
                  <div className="text-center">
                    <h3 className="font-display font-black text-lg text-slate-800">Semaine 3: Argumentation</h3>
                    <p className="text-slate-500 text-xs mt-1">Convaincre par l'écrit</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-16">
                    {/* Lesson 8 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[12])}>
                      <div className="w-14 h-14 bg-emerald-500 border-4 border-white text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-white fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-semibold text-slate-600">Leçon 8</span>
                    </div>
                    {/* Lesson 9 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[13])}>
                      <div className="w-14 h-14 bg-emerald-500 border-4 border-white text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-white fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-semibold text-slate-600">Leçon 9</span>
                    </div>
                    {/* Lesson 10 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[14])}>
                      <div className="w-14 h-14 bg-emerald-500 border-4 border-white text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-white fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-semibold text-slate-600">Leçon 10</span>
                    </div>
                  </div>
                </div>

                {/* 9. CHECKPOINT 3 */}
                <div 
                  className="w-16 h-16 border-4 border-emerald-500 bg-white rounded-full flex items-center justify-center cursor-pointer group transition-transform hover:scale-110 relative shadow-sm"
                  onClick={() => handleNodeClick(nodes[15])}
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  <div className="absolute -bottom-8 whitespace-nowrap text-[9px] font-mono text-emerald-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                    CHECKPOINT 3
                  </div>
                </div>

                {/* 10. PROJET: LE DÉBAT */}
                <div 
                  className="relative group flex flex-col items-center cursor-pointer" 
                  onClick={() => handleNodeClick(nodes[16])}
                >
                  <div 
                    className="w-24 h-24 bg-[#002B5B] border-4 border-white text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all" 
                    style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }}
                  >
                    <FileEdit className="w-9 h-9 text-white" />
                  </div>
                  <span className="mt-4 font-black text-xs text-[#002B5B] uppercase tracking-wider">✍️ PROJET: LE DÉBAT</span>
                </div>

                {/* 11. SEMAINE 4 (Current Week) */}
                <div className="w-full flex flex-col items-center gap-12">
                  <div className="text-center">
                    <h3 className="font-display font-black text-lg text-slate-800">Semaine 4: Maîtrise Orale</h3>
                    <p className="text-slate-500 text-xs mt-1">L'éloquence au service des idées</p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-16 relative">
                    
                    {/* Leçon 11 */}
                    <div className="flex flex-col items-center cursor-pointer animate-fade-in" onClick={() => handleNodeClick(nodes[17])}>
                      <div className="w-14 h-14 bg-emerald-500 border-4 border-white text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-white fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-semibold text-slate-600">Leçon 11</span>
                    </div>

                    {/* Leçon 12 */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[18])}>
                      <div className="w-14 h-14 bg-emerald-500 border-4 border-white text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all">
                        <Star className="w-6 h-6 text-white fill-current" />
                      </div>
                      <span className="mt-2 text-xs font-semibold text-slate-600">Leçon 12</span>
                    </div>

                    {/* Leçon 13 (UNLOCKED OUTLINE NODE) */}
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => handleNodeClick(nodes[19])}>
                      <div className="w-14 h-14 border-2 border-blue-500 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-all">
                        <Star className="w-6 h-6 text-blue-500" />
                      </div>
                      <span className="mt-2 text-xs font-semibold text-blue-500">Leçon 13</span>
                    </div>

                  </div>
                </div>

                {/* 12. CHECKPOINT FINAL */}
                <div 
                  className="w-16 h-16 border-4 border-slate-300 bg-slate-50 rounded-full flex items-center justify-center cursor-pointer opacity-75 transition-transform hover:scale-110 relative"
                  onClick={() => handleNodeClick(nodes[20])}
                >
                  <CheckCircle2 className="w-6 h-6 text-slate-400" />
                  <div className="absolute -bottom-8 whitespace-nowrap text-[9px] font-mono text-slate-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                    CHECKPOINT FINAL
                  </div>
                </div>

                {/* 13. PROJET: L'ORAL (Locked) */}
                <div 
                  className="relative group flex flex-col items-center cursor-pointer" 
                  onClick={() => handleNodeClick(nodes[21])}
                >
                  <div 
                    className="w-24 h-24 bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center shadow-sm hover:scale-105 transition-all opacity-75" 
                    style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }}
                  >
                    <Mic className="w-9 h-9 text-slate-400" />
                  </div>
                  <span className="mt-4 font-bold text-slate-400 text-xs uppercase tracking-wider">🎙️ PROJET: L'ORAL</span>
                </div>

                {/* 14. REMISE DES DIPLÔMES */}
                <div 
                  className="mt-12 flex flex-col items-center cursor-pointer group"
                  onClick={() => handleNodeClick(nodes[22])}
                >
                  <div className="w-24 h-24 bg-blue-50 border-2 border-blue-200 rotate-45 flex items-center justify-center shadow-sm opacity-75 group-hover:scale-105 transition-all">
                    <GraduationCap className="-rotate-45 w-10 h-10 text-blue-600" />
                  </div>
                  <span className="mt-10 font-display font-bold text-sm text-blue-800 uppercase tracking-widest">REMISE DES DIPLÔMES 🎓</span>
                </div>

              </div>
            </div>
          </div>

          {/* Floating Right Progress Panel (Desktop only) */}
          <aside className="hidden lg:block absolute right-8 top-8 w-80 z-20">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl space-y-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-display font-black text-sm text-[#002B5B] uppercase tracking-wider">Progression</h4>
                <span className="text-blue-600 font-bold text-sm">85%</span>
              </div>
              
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[85%] rounded-full shadow-xs" />
              </div>

              <div className="space-y-4">
                
                {/* Milestone 1 */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Trophy className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">Objectif atteint</p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Maîtrise de l'argumentation</p>
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 text-blue-600 fill-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800 font-sans">Série en cours</p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{userStreak} jours consécutifs</p>
                  </div>
                </div>

              </div>

              <button 
                onClick={() => setCurrentView("lesson-viewer")}
                className="w-full py-4 bg-[#002B5B] hover:bg-opacity-90 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:scale-102 active:scale-100 cursor-pointer"
              >
                Continuer le Parcours
              </button>
            </div>
          </aside>

          {/* Mobile Bottom Sheet Progress (hidden on desktop) */}
          <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 border-t border-slate-200 shadow-xl rounded-t-3xl p-5 z-40 backdrop-blur-md flex items-center justify-between">
            <div>
              <h4 className="text-slate-800 font-black text-xs uppercase tracking-wider">85% du Parcours</h4>
              <p className="text-slate-500 text-[10px] font-semibold mt-0.5">Prochaine: Leçon 1 (En cours)</p>
            </div>
            <button 
              onClick={() => setCurrentView("lesson-viewer")}
              className="px-6 py-3 bg-[#002B5B] hover:bg-opacity-90 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
            >
              Continuer
            </button>
          </div>
          </>
          ) : (
            /* ==================== STATS & PERFORMANCE HISTORIC PANEL ==================== */
            <div className="flex-1 overflow-y-auto custom-scrollbar h-[calc(100vh-8rem)] p-4 md:p-8 space-y-8 bg-[#fcfcfd] text-slate-800">
              
              {/* Row 1: Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-[#002B5B]/30 transition-all">
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Simulations Jouées</span>
                  <div className="font-display font-black text-4xl text-slate-800 tracking-tight">{attempts.length}</div>
                  <p className="text-[10px] font-semibold text-slate-400">Attempts complets de 2h30</p>
                </div>

                <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-[#002B5B]/30 transition-all">
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Score Moyen</span>
                  <div className="font-display font-black text-4xl text-[#002B5B] tracking-tight">
                    {attempts.length > 0 ? Math.round(attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length) : 0}%
                  </div>
                  <p className="text-[10px] font-semibold text-slate-400">Équivalent Grade WAEC: B2</p>
                </div>

                <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-[#002B5B]/30 transition-all">
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Meilleur Score</span>
                  <div className="font-display font-black text-4xl text-emerald-600 tracking-tight">
                    {attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : 0}%
                  </div>
                  <p className="text-[10px] font-semibold text-slate-400">Mention Très Bien (A1)</p>
                </div>

                <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-[#002B5B]/30 transition-all">
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Niveau Global IA</span>
                  <div className="font-display font-black text-2xl text-[#002B5B] tracking-tight pt-1">Élite WAEC</div>
                  <p className="text-[10px] font-semibold text-slate-400">Prêt à 94% pour le concours</p>
                </div>
              </div>

              {/* Row 2: Score Trend Chart & Readiness */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* SVG Chart Container */}
                <div className="lg:col-span-2 bg-white border border-slate-200 shadow-xs rounded-3xl p-6 space-y-6">
                  <div>
                    <h3 className="font-display font-black text-base text-slate-800">Évolution de la Performance</h3>
                    <p className="text-slate-500 text-xs font-semibold mt-1">Comparatif chronologique de vos simulations d'examen blanc</p>
                  </div>

                  <div className="w-full h-64 relative bg-slate-50 border border-slate-100 rounded-2xl p-4">
                    {attempts.length > 1 ? (
                      <svg viewBox="0 0 500 240" className="w-full h-full text-slate-400 font-mono text-[9px] font-bold">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#002B5B" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#002B5B" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="40" y1="30" x2="480" y2="30" stroke="#f1f5f9" strokeDasharray="4,4" />
                        <line x1="40" y1="90" x2="480" y2="90" stroke="#f1f5f9" strokeDasharray="4,4" />
                        <line x1="40" y1="150" x2="480" y2="150" stroke="#f1f5f9" strokeDasharray="4,4" />
                        <line x1="40" y1="210" x2="480" y2="210" stroke="#cbd5e1" />

                        {/* Y Labels */}
                        <text x="30" y="34" textAnchor="end" className="fill-slate-400">100%</text>
                        <text x="30" y="94" textAnchor="end" className="fill-slate-400">75%</text>
                        <text x="30" y="154" textAnchor="end" className="fill-slate-400">50%</text>
                        <text x="30" y="214" textAnchor="end" className="fill-slate-400">0%</text>

                        {/* Connection line & Gradient fill */}
                        {(() => {
                          const points = attempts.map((a, idx) => {
                            const segmentSize = attempts.length > 1 ? 400 / (attempts.length - 1) : 400;
                            const x = 50 + idx * segmentSize;
                            const y = 210 - (a.score / 100) * 180;
                            return { x, y, score: a.score, date: a.date.split(",")[0] };
                          });
                          const pointsString = points.map(p => `${p.x},${p.y}`).join(" ");
                          const fillString = `50,210 ${pointsString} ${points[points.length - 1].x},210`;

                          return (
                            <>
                              <polygon points={fillString} fill="url(#chartGradient)" />
                              <polyline points={pointsString} fill="none" stroke="#002B5B" strokeWidth="3" style={{ filter: "drop-shadow(0 4px 6px rgba(0, 43, 91, 0.15))" }} />
                              {points.map((p, i) => (
                                <g key={i} className="group/point">
                                  <circle cx={p.x} cy={p.y} r="8" className="fill-blue-500/10 group-hover/point:fill-blue-500/20 cursor-pointer transition-all" />
                                  <circle cx={p.x} cy={p.y} r="4" className="fill-[#002B5B] stroke-white stroke-2 cursor-pointer" />
                                  <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[10px] font-black fill-[#002B5B]">{p.score}%</text>
                                  <text x={p.x} y="228" textAnchor="middle" className="text-[8px] font-bold fill-slate-400">{p.date}</text>
                                </g>
                              ))}
                            </>
                          );
                        })()}
                      </svg>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-2 text-center p-4">
                        <Activity className="w-10 h-10 text-slate-300 animate-pulse" />
                        <h4 className="text-xs font-black text-slate-700">Pas assez de données pour le graphique</h4>
                        <p className="text-[10px] max-w-xs leading-relaxed font-semibold">Réalisez au moins deux examens Blitz pour tracer votre courbe d'amélioration.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtopic Readiness (Bento boxes for special disciplines) */}
                <div className="bg-white border border-slate-200 shadow-xs rounded-3xl p-6 space-y-6">
                  <div>
                    <h3 className="font-display font-black text-base text-slate-800">Par Thème de l'Examen</h3>
                    <p className="text-slate-500 text-xs font-semibold mt-1">Niveau d'assimilation par sous-discipline clé</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-700">Philosophie Politique (WAEC B)</span>
                        <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg text-[10px]">88% Prêt</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: "88%" }} />
                      </div>
                      <p className="text-[9px] text-slate-500 leading-relaxed font-bold">
                        Maîtrise complète de l'analyse des textes institutionnels et philosophiques.
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2.5">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-slate-700">Littérature Classique (WAEC C)</span>
                        <span className="text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg text-[10px]">79% Prêt</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: "79%" }} />
                      </div>
                      <p className="text-[9px] text-slate-500 leading-relaxed font-bold">
                        Bonne intégration des figures de style classiques. Pensez à l'accord des adjectifs de couleur.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Bento Grid Detail Sub-topic Readiness */}
              <div className="space-y-4">
                <h3 className="font-display font-black text-base text-slate-800">Analyse de Préparation Fine</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-5 space-y-3">
                    <span className="text-[10px] font-mono font-black text-amber-800 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 inline-block">Grammaire & Conjugaison</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-black text-slate-800">Élision & Subjonctif</span>
                      <span className="text-xs font-bold text-emerald-600 font-mono">92%</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">Excellent emploi des temps du subjonctif après les conjonctions exprimant le doute.</p>
                    <div className="text-[10px] font-bold text-amber-800 bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl">
                      💡 Réviser : l'inversion du sujet interrogatif.
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-5 space-y-3">
                    <span className="text-[10px] font-mono font-black text-amber-800 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 inline-block">Vocabulaire & Idiotismes</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-black text-slate-800">Richesse Lexicale</span>
                      <span className="text-xs font-bold text-emerald-600 font-mono">95%</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">Excellente utilisation d'idiotismes raffinés qui distinguent votre copie d'un candidat ordinaire.</p>
                    <div className="text-[10px] font-bold text-amber-800 bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl">
                      💡 Réviser : les expressions pour lettre formelle.
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 shadow-xs rounded-2xl p-5 space-y-3">
                    <span className="text-[10px] font-mono font-black text-amber-800 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 inline-block">Rédaction & Structuration</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-black text-slate-800">Articulations Logiques</span>
                      <span className="text-xs font-bold text-amber-600 font-mono">74%</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">Structure formelle soignée mais manque de fluidité dans la transition entre les paragraphes.</p>
                    <div className="text-[10px] font-bold text-amber-800 bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl">
                      💡 Réviser : connecteurs logiques de concession.
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Attempt History Table */}
              <div className="bg-white border border-slate-200 shadow-xs rounded-3xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-black text-base text-slate-800">Historique Récent des Simulations</h3>
                    <p className="text-slate-500 text-xs font-semibold mt-1">Détail complet de vos 2h30 d'épreuves de Blitz</p>
                  </div>
                  <button 
                    onClick={() => setCurrentView("blitz")}
                    className="bg-[#002B5B] hover:bg-opacity-90 text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg transition-transform hover:scale-102 cursor-pointer text-center"
                  >
                    Nouveau Blitz ⚡
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-semibold">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-mono font-bold uppercase tracking-wider">
                        <th className="py-3 px-4">Date de Simulation</th>
                        <th className="py-3 px-4">Score Global</th>
                        <th className="py-3 px-4">Grade Estimé</th>
                        <th className="py-3 px-4">Section A/B/C</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {attempts.map((att) => (
                        <tr key={att.id} className="hover:bg-slate-50 border-b border-slate-100">
                          <td className="py-4 px-4 font-black text-slate-700">{att.date}</td>
                          <td className="py-4 px-4">
                            <span className={`font-mono font-black text-sm px-2.5 py-1 rounded-lg ${
                              att.score >= 80 ? "text-emerald-700 bg-emerald-50 border border-emerald-100" :
                              att.score >= 70 ? "text-amber-700 bg-amber-50 border border-amber-100" :
                              "text-rose-700 bg-rose-50 border border-rose-100"
                            }`}>
                              {att.score}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-600 font-bold">{att.grade}</td>
                          <td className="py-4 px-4 font-mono text-[10px] text-slate-400">
                            A: {att.sectionA}% • B: {att.sectionB}% • C: {att.sectionC}%
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => {
                                localStorage.setItem("current_correction_attempt", JSON.stringify(att));
                                setCurrentView("blitz");
                              }}
                              className="text-[#002B5B] hover:text-blue-700 hover:underline text-xs font-black cursor-pointer"
                            >
                              Consulter le Corrigé Détaillé 🔍
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>

      </div>

      {/* 4. MODAL POPUP FOR MAP NODES */}
      {showPopup && selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={closePopup} />
          
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-3xl p-6 relative z-10 shadow-2xl text-left scale-100 transition-all">
            <div className="flex justify-between items-start mb-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/10 shrink-0">
                {React.createElement(selectedNode.icon || Star, { className: "w-8 h-8 stroke-[2.2]" })}
              </div>
              <button 
                onClick={closePopup}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-display font-black text-lg text-slate-800 mb-2">{selectedNode.title}</h3>
            
            <div className="flex gap-2.5 mb-4">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black font-mono border uppercase ${
                selectedNode.status === "Complété" 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : selectedNode.status === "En cours"
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-slate-100 border-slate-200 text-slate-500"
              }`}>
                {selectedNode.status}
              </span>

              {selectedNode.score && (
                <span className="px-2.5 py-1 bg-emerald-50 rounded-full text-[10px] font-mono text-emerald-700 font-extrabold border border-emerald-200">
                  Score: {selectedNode.score}
                </span>
              )}
            </div>

            <p className="text-slate-600 text-xs font-medium leading-relaxed mb-6">
              {selectedNode.description}
            </p>

            <div className="space-y-2">
              {selectedNode.status === "Complété" && (
                <button
                  onClick={() => {
                    setShowPopup(false);
                    if (selectedNode.id === "l1") {
                      setCurrentView("lesson-viewer");
                    } else if (selectedNode.id === "p1") {
                      setCurrentView("la-lettre");
                    } else if (selectedNode.id === "p2") {
                      setCurrentView("la-traduction");
                    } else if (selectedNode.id === "p3") {
                      setCurrentView("la-debat");
                    } else if (selectedNode.id === "p4") {
                      setCurrentView("la-oral");
                    } else if (selectedNode.id.startsWith("cp")) {
                      localStorage.setItem("active_checkpoint_exam", selectedNode.id);
                      localStorage.setItem("active_checkpoint_title", selectedNode.title);
                      setCurrentView("exams");
                    } else {
                      startLesson();
                    }
                  }}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-slate-200 shadow-xs"
                >
                  Réviser la leçon
                </button>
              )}

              {selectedNode.status === "En cours" && (
                <button
                  onClick={() => {
                    setShowPopup(false);
                    if (selectedNode.id === "l1") {
                      setCurrentView("lesson-viewer");
                    } else if (selectedNode.id === "p1") {
                      setCurrentView("la-lettre");
                    } else if (selectedNode.id === "p2") {
                      setCurrentView("la-traduction");
                    } else if (selectedNode.id === "p3") {
                      setCurrentView("la-debat");
                    } else if (selectedNode.id === "p4") {
                      setCurrentView("la-oral");
                    } else if (selectedNode.id.startsWith("cp")) {
                      localStorage.setItem("active_checkpoint_exam", selectedNode.id);
                      localStorage.setItem("active_checkpoint_title", selectedNode.title);
                      setCurrentView("exams");
                    } else {
                      startLesson();
                    }
                  }}
                  className="w-full py-3.5 bg-[#002B5B] hover:bg-opacity-90 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Commencer
                </button>
              )}

              {selectedNode.status === "Déverrouillé" && (
                <button
                  onClick={() => {
                    setShowPopup(false);
                    if (selectedNode.id === "l1") {
                      setCurrentView("lesson-viewer");
                    } else if (selectedNode.id === "p1") {
                      setCurrentView("la-lettre");
                    } else if (selectedNode.id === "p2") {
                      setCurrentView("la-traduction");
                    } else if (selectedNode.id === "p3") {
                      setCurrentView("la-debat");
                    } else if (selectedNode.id === "p4") {
                      setCurrentView("la-oral");
                    } else if (selectedNode.id.startsWith("cp")) {
                      localStorage.setItem("active_checkpoint_exam", selectedNode.id);
                      localStorage.setItem("active_checkpoint_title", selectedNode.title);
                      setCurrentView("exams");
                    } else {
                      startLesson();
                    }
                  }}
                  className="w-full py-3.5 bg-[#002B5B] hover:bg-opacity-90 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Commencer
                </button>
              )}

              {selectedNode.status === "Locked" && (
                <button
                  disabled
                  className="w-full py-3 bg-slate-50 text-slate-400 font-black text-xs uppercase tracking-wider rounded-xl cursor-not-allowed border border-slate-200 text-center animate-none"
                >
                  Verrouillé
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 5. INTERACTIVE LEÇON MODAL SIMULATOR */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden relative text-left">
            
            {/* Modal header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full font-mono font-black uppercase">
                  Leçon active
                </span>
                <h3 className="text-sm font-black text-slate-800">Figures de Style</h3>
              </div>
              <button 
                onClick={() => setShowLessonModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                title="Quitter"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            {lessonStep === 1 ? (
              <div className="p-6 space-y-6">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-4">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 shrink-0">
                    <Volume2 className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-mono font-black tracking-widest text-slate-400">
                      AUDIO DU TUTEUR
                    </p>
                    <p className="text-xs font-semibold text-slate-700 mt-1 leading-relaxed">
                      "{quizQuestions.audioText}"
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-wider font-mono">
                    Sélectionnez la meilleure réponse argumentative:
                  </p>
                  {quizQuestions.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      className={`w-full text-left p-4 rounded-2xl text-xs font-semibold leading-relaxed transition-all cursor-pointer border ${
                        selectedAnswer === idx
                          ? idx === quizQuestions.correctIndex
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs shadow-emerald-500/5"
                            : "bg-rose-50 border-rose-300 text-rose-800 shadow-xs shadow-rose-500/5"
                          : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-black shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {answerStatus !== "idle" && (
                  <div className={`p-4 rounded-2xl border ${
                    answerStatus === "correct" 
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-rose-50 border-rose-200 text-rose-800"
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      {answerStatus === "correct" ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">Félicitations! +50 XP</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-rose-600" />
                          <span className="text-xs font-black text-rose-600 uppercase tracking-wider">Erreur. Essayez encore!</span>
                        </>
                      )}
                    </div>
                    {answerStatus === "correct" && (
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                        {quizQuestions.explanation}
                      </p>
                    )}
                  </div>
                )}

                {answerStatus === "correct" && (
                  <button
                    onClick={() => setLessonStep(2)}
                    className="w-full bg-[#002B5B] hover:bg-opacity-90 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Valider l'Étape
                  </button>
                )}
              </div>
            ) : (
              <div className="p-6 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
                  <Award className="w-10 h-10" />
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-800">Leçon validée! 🎉</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed">
                    Vous venez de remporter 50 XP. Votre progression a été enregistrée avec succès!
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowLessonModal(false);
                    setCurrentView("dashboard");
                  }}
                  className="w-full bg-[#002B5B] hover:bg-opacity-90 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Retour au Tableau de Bord
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
