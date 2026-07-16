import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuizWidget from "../../components/QuizWidget";
import { useAuthStore } from "../../stores/authStore";
import { 
  GraduationCap, Star, Play, Lock, Settings, Bell, ChevronRight, Sparkles,
  Mic, Trophy, BookOpen, Compass, Award, Activity, Heart, ArrowLeft, Check,
  Volume2, CheckCircle2, MessageSquare, Flag, Mail, Newspaper, FileEdit, X, Shield, Menu, Search, Moon, RotateCcw, Users, HelpCircle, Calendar, Flame, Clock
} from "lucide-react";

export default function QuizPage() {
  const navigate = useNavigate();
  const { user, updateXP, updateStreak } = useAuthStore();
  const userXP = user?.xp ?? 680;
  const userStreak = user?.streak ?? 12;
  const isPremium = user?.isPremium ?? false;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const handleSetCurrentView = (view: string) => {
    if (view === "dashboard") navigate("/dashboard");
    else if (view === "parcours") navigate("/parcours");
    else if (view === "blitz") navigate("/blitz");
    else if (view === "quiz") navigate("/quiz");
    else if (view === "validation") navigate("/validation");
    else if (view === "chat") navigate("/chat");
    else if (view === "profile") navigate("/profil");
    else if (view === "plan-selection") navigate("/plan-selection");
    else if (view === "landing") navigate("/");
    else if (view === "ranking" || view === "classement") navigate("/classement");
    else if (view === "mes-cours") navigate("/mes-cours");
    else if (view === "exams") navigate("/examens");
    else if (view === "la-lettre") navigate("/projets/la-lettre");
    else if (view === "la-traduction") navigate("/projets/la-traduction");
    else if (view === "la-debat") navigate("/projets/la-debat");
    else if (view === "la-oral") navigate("/projets/la-oral");
    else if (view === "onboarding") navigate("/onboarding");
  };

  // Sidebar navigation options
  const sidebarItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: Compass },
    { id: "parcours", label: "Parcours", icon: Award },
    { id: "courses", label: "Mes Cours", icon: BookOpen },
    { id: "blitz", label: "Le Blitz", icon: Play },
    { id: "leaderboard", label: "Classement", icon: Trophy },
    { id: "progression", label: "Ma Progression", icon: Activity },
    { id: "badges", label: "Mes Badges", icon: Star },
    { id: "certificate", label: "Certificat", icon: Award },
  ];

  const handleGainXP = (amount: number) => {
    updateXP((prev) => prev + amount);
  };

  const handleIncrementStreak = () => {
    updateStreak((prev) => prev + 1);
  };

  return (
    <div className="w-full min-h-screen bg-[#fcfcfd] text-slate-800 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1. Side Navigation Rail */}
      <aside className={`border-r border-slate-100 bg-white flex flex-col justify-between shrink-0 fixed md:sticky left-0 top-0 h-screen z-50 transition-all duration-300 ${
        isSidebarOpen 
          ? "w-64 translate-x-0 opacity-100" 
          : "w-0 -translate-x-full md:translate-x-0 md:opacity-0 md:w-0 overflow-hidden border-r-0 pointer-events-none"
      }`}>
        <div className="p-6">
          {/* Logo with Cap Icon */}
          <div className="flex items-center justify-between mb-8">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleSetCurrentView("landing")}
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
              return (
                <button
                  key={item.id}
                  id={`sidebar-item-${item.id}`}
                  onClick={() => {
                    if (item.id === "dashboard") handleSetCurrentView("dashboard");
                    else if (item.id === "parcours") handleSetCurrentView("parcours");
                    else if (item.id === "blitz") handleSetCurrentView("blitz");
                    else if (item.id === "exams") handleSetCurrentView("exams");
                    else if (item.id === "leaderboard") handleSetCurrentView("classement");
                    else if (item.id === "badges" || item.id === "certificate") handleSetCurrentView("profile");
                    else if (item.id === "courses") handleSetCurrentView("mes-cours");
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    false 
                      ? "bg-blue-50 text-blue-700 border border-blue-100" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${false ? "text-blue-600" : ""}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === "exams" && (
                    <span className="bg-rose-500/15 text-rose-400 text-[8px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border border-rose-500/25">IA</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Settings */}
        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={() => handleSetCurrentView("dashboard")}
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
                ⚡ {userXP} XP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Center Search Bar */}
            <div className="hidden md:flex items-center relative w-full max-w-md mx-6">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="app-header-search"
                type="text"
                placeholder="Rechercher un cours, un badge..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl py-2 px-10 text-xs font-medium text-slate-600 outline-none transition-all"
              />
            </div>

            <nav className="hidden md:flex gap-6 text-xs font-bold">
              <button onClick={() => handleSetCurrentView("landing")} className="text-slate-500 hover:text-blue-600 transition-colors">Home</button>
              <button onClick={() => handleSetCurrentView("dashboard")} className="text-slate-500 hover:text-blue-600 transition-colors">Dashboard</button>
              <button onClick={() => handleSetCurrentView("plan-selection")} className="text-slate-500 hover:text-blue-600 transition-colors">Pricing</button>
            </nav>

            <div className="flex items-center gap-4">
              {/* Theme contrast icon */}
              <button 
                id="theme-contrast-toggle" 
                className="p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                title="Changer de thème"
              >
                <Moon className="w-4 h-4" />
              </button>

              <button className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 relative cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
              </button>
              
              <div 
                className="w-10 h-10 rounded-full border-2 border-amber-400 p-0.5 shrink-0 cursor-pointer"
                onClick={() => handleSetCurrentView("profile")}
              >
                <div className="w-full h-full rounded-full bg-[#002B5B] flex items-center justify-center text-white text-xs font-black">
                  JI
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Scrollable Content */}
        <main className="flex-1 relative overflow-y-auto custom-scrollbar h-[calc(100vh-8rem)] bg-[#fcfcfd] text-slate-800 p-8">
          
          {/* Premium Banner Offer (Only shown if not premium) */}
          {!isPremium ? (
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-3xl p-4 md:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500 rounded-2xl text-white shadow-xs shrink-0">
                  <Sparkles className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <p className="text-xs font-black text-amber-900 uppercase tracking-wider font-mono">Période d'essai active (Jour 3 sur 7) ⏳</p>
                  <p className="text-[11px] text-amber-700 font-semibold mt-0.5">Profitez d'un accès de base. Libérez tout votre potentiel WAEC avec le Pass Premium.</p>
                </div>
              </div>
              <button
                id="upgrade-to-premium-dash"
                onClick={() => handleSetCurrentView("plan-selection")}
                className="w-full sm:w-auto shrink-0 bg-[#002B5B] hover:bg-blue-800 text-white font-extrabold text-[10px] uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-sm text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                Devenir Premium
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-3xl p-4.5 mb-6 flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500 rounded-2xl text-white shadow-xs shrink-0">
                  <Sparkles className="w-5 h-5 fill-white animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-black text-emerald-800 uppercase tracking-wider font-mono">Pass Premium Actif 🌟</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Accès illimité à la Cohorte 1, mode Le Blitz et simulations d'examens.</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono font-bold uppercase px-3 py-1 rounded-full inline-flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Défis Quotidiens
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#002B5B] tracking-tight mt-2">
              Pratique d'Examen Interactive
            </h2>
          </div>
          <QuizWidget 
            onGainXP={handleGainXP} 
            incrementStreak={handleIncrementStreak} 
          />

        </main>
      </div>
    </div>
  );
}
