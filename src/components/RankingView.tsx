/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, Star, Flame, Award, Globe, Users, TrendingUp, TrendingDown, Minus, 
  Search, ShieldAlert, Calendar, ArrowRight, ArrowLeft, Clock, UserCheck, X,
  GraduationCap
} from "lucide-react";

interface RankingViewProps {
  userXP: number;
  userStreak: number;
  setCurrentView: (view: string) => void;
  userFullName?: string;
  isPremium?: boolean;
}

interface Student {
  rank: number;
  diff: string; // "up" | "down" | "same" | "new"
  diffVal?: string;
  name: string;
  country: string;
  flag: string;
  xp: number;
  blitz: string;
  streak: string;
  avatar?: string;
  isUser?: boolean;
  school?: string;
}

interface School {
  rank: number;
  name: string;
  country: string;
  students: number;
  avgXp: number;
  topStudent: string;
}

export default function RankingView({
  userXP,
  userStreak,
  setCurrentView,
  userFullName = "Johnfavour Igboeche",
  isPremium = false
}: RankingViewProps) {
  const [activeTab, setActiveTab] = useState<"national" | "nigeria" | "school">("national");
  const [sortBy, setSortBy] = useState<"xp" | "blitz">("xp");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isRegisteredForBlitz, setIsRegisteredForBlitz] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // Student ranking data
  const nationalStudents: Student[] = [
    { rank: 1, diff: "same", name: "Ama Afriyie", country: "Ghana", flag: "🇬🇭", xp: 1240, blitz: "11/11", streak: "18 🔥", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCa4vuvgeb5RvEHwrvTNag6MNWdUJw55m1ooZ2XCVUtkPMZqeJ2zx5obdf6EX6-1tsTdsxglPxkKd0215HYFRvwoty0ZhWsW8BRTvfCaszXffDet9aqvL6ovrWvwwhtru1IOtctjhMeGwIAf3EPBHKJa8A5wULHaUGQIm3dVwQccOT0dVbZqWXVzWmUTx1NvAtKmNxIHEmsOBoGjqH6_zOTdN8lPeMkvFBavxV2oeFMNxxvCp7ayYGldA" },
    { rank: 2, diff: "same", name: "Chidi Kalu", country: "Nigeria", flag: "🇳🇬", xp: 845, blitz: "10/11", streak: "14 🔥", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1-d54NRyl9Ump_Ed7615rQjNP5BEcSrQL-pQp4i0YV0gHp9NfjU4a1DfwBZcmsPn36BOhwgGyvL-saf_DyJGh3MOsSmLl0pJ08T-t9xukqWYnqIxLwsb6r3Eq-PvYBYWExtaHHJvih5UzHZtH2U6xLHfNz3j-0qGvcp32Gaa6sLA5sYWxKOEDrBxj7O4fvFIVUYoddGyNWaYYi0ZifCc782X5uSjRL9cxBevHtCh4dCzUS-Py44755g" },
    { rank: 3, diff: "same", name: "Kwame Boakye", country: "Côte d'Ivoire", flag: "🇨🇮", xp: 710, blitz: "9/11", streak: "11 🔥", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMbf5eeXY6r6B1k6OYS52TnH5Ab_3bCWWrak4rFyzncoAUG2oU4Zum5bnJyDEnCB27XDZoiHjXHltdbx8gsXuHrr6FKpqNnDJTol3W4xERDqm4lYc0PpMhfGBLNKDKnXZZzrwgHVkpwXImZKsqy76mxI-o0TYVzucrlPPfhzOCuQrtMSD3Pita71O_S8GfOFb0753tdTouVXdfkdXJ583rqpdmhQRYguEnJUftpuTIxmKplghS-DCCew" },
    { rank: 4, diff: "up", diffVal: "1", name: "Keziah Nduta", country: "Kenya", flag: "🇰🇪", xp: 695, blitz: "9/11", streak: "12 🔥", school: "Lycée de Nairobi" },
    { rank: 5, diff: "up", diffVal: "3", name: userFullName, country: "Nigeria", flag: "🇳🇬", xp: userXP, blitz: "8/11", streak: `${userStreak} 🔥`, isUser: true, school: "Lycée International" },
    { rank: 6, diff: "same", name: "Samuel Osei", country: "Ghana", flag: "🇬🇭", xp: 675, blitz: "8/11", streak: "4 🔥" },
    { rank: 7, diff: "down", diffVal: "2", name: "Nadine Tchakounté", country: "Cameroun", flag: "🇨🇲", xp: 640, blitz: "10/11", streak: "15 🔥" },
    { rank: 8, diff: "up", diffVal: "2", name: "Funke Okeke", country: "Nigeria", flag: "🇳🇬", xp: 630, blitz: "8/11", streak: "9 🔥" },
    { rank: 9, diff: "down", diffVal: "1", name: "Abdoulaye Diallo", country: "Sénégal", flag: "🇸🇳", xp: 615, blitz: "7/11", streak: "5 🔥" },
    { rank: 10, diff: "new", name: "Mariam Toure", country: "Mali", flag: "🇲🇱", xp: 590, blitz: "8/11", streak: "3 🔥" },
    { rank: 11, diff: "down", diffVal: "3", name: "Femi Adebayo", country: "Nigeria", flag: "🇳🇬", xp: 560, blitz: "6/11", streak: "6 🔥" },
    { rank: 12, diff: "up", diffVal: "1", name: "Fatoumata Sow", country: "Guinée", flag: "🇬🇳", xp: 540, blitz: "7/11", streak: "8 🔥" }
  ];

  const nigeriaStudents: Student[] = [
    { rank: 1, diff: "same", name: "Chidi Kalu", country: "Nigeria", flag: "🇳🇬", xp: 845, blitz: "10/11", streak: "14 🔥", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1-d54NRyl9Ump_Ed7615rQjNP5BEcSrQL-pQp4i0YV0gHp9NfjU4a1DfwBZcmsPn36BOhwgGyvL-saf_DyJGh3MOsSmLl0pJ08T-t9xukqWYnqIxLwsb6r3Eq-PvYBYWExtaHHJvih5UzHZtH2U6xLHfNz3j-0qGvcp32Gaa6sLA5sYWxKOEDrBxj7O4fvFIVUYoddGyNWaYYi0ZifCc782X5uSjRL9cxBevHtCh4dCzUS-Py44755g" },
    { rank: 2, diff: "up", diffVal: "1", name: userFullName, country: "Nigeria", flag: "🇳🇬", xp: userXP, blitz: "8/11", streak: `${userStreak} 🔥`, isUser: true, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBGDfIBBta9NYpD39hL20RMTyaXfaj-Ci3RWSqGly9lXzFNnmX8TgbmCClhdUT-q-9xu_qpbQFUgbxqF_x8-jL5yjxUBuZHU-tP_v2jj9DqZ4YfSv1_cmTLGR1amhKkqe2ty_5F4p-oMrPDm8qB2J2sy3V54AXVEBE6Iux5kPS7POQj-yVEgV3-LL9xciYoqlbkp5sA9j86f7T-rNA145VFkhExOyF9yE8pj7t0I9pKPtHr4LSdmiRI8A" },
    { rank: 3, diff: "down", diffVal: "1", name: "Funke Okeke", country: "Nigeria", flag: "🇳🇬", xp: 630, blitz: "8/11", streak: "9 🔥", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDF2X7Ag4Zp0g_AOaIRtHegp2VWKZW-g5kUzq_nLjfmooRnCdtLtsfmV3xcFwKXND3Un__7ghX_-a-MJceUZeJzXP6foAQ4fuosgO7PsZQ1X4Ngc1G-9z48zguSPuIhbDDGcZ6TsqBgts1BLpXHkQKAj2MGDf3RicANcQRdAh5hUbIJxNui9_GXKlP_PyTq-WlemYMgSpan65gztnfU3MDeczGJpzi0aR1-AnItaSlimsF8jWO48vgnPg" },
    { rank: 4, diff: "same", name: "Femi Adebayo", country: "Nigeria", flag: "🇳🇬", xp: 560, blitz: "6/11", streak: "6 🔥" },
    { rank: 5, diff: "up", diffVal: "2", name: "Blessing Taiwo", country: "Nigeria", flag: "🇳🇬", xp: 510, blitz: "7/11", streak: "2 🔥" },
    { rank: 6, diff: "down", diffVal: "1", name: "Tobi Alabi", country: "Nigeria", flag: "🇳🇬", xp: 480, blitz: "5/11", streak: "4 🔥" },
    { rank: 7, diff: "new", name: "Nneka Nwosu", country: "Nigeria", flag: "🇳🇬", xp: 440, blitz: "6/11", streak: "1 🔥" }
  ];

  const schoolsData: School[] = [
    { rank: 1, name: "Achimota School", country: "🇬🇭 GH", students: 450, avgXp: 890, topStudent: "Ama Afriyie" },
    { rank: 2, name: "King's College Lagos", country: "🇳🇬 NG", students: 620, avgXp: 845, topStudent: "Chidi Kalu" },
    { rank: 3, name: "Prempeh College", country: "🇬🇭 GH", students: 380, avgXp: 780, topStudent: "Samuel Osei" },
    { rank: 4, name: "FGGC Benin", country: "🇳🇬 NG", students: 510, avgXp: 740, topStudent: "Funke Okeke" },
    { rank: 5, name: "University of Port Harcourt", country: "🇳🇬 NG", students: 900, avgXp: 710, topStudent: userFullName }
  ];

  // Helper to render difference indicator
  const renderDiffIndicator = (diff: string, val?: string) => {
    switch (diff) {
      case "up":
        return (
          <span className="flex items-center gap-0.5 text-emerald-500 font-bold text-xs">
            <TrendingUp className="w-3.5 h-3.5 shrink-0" />
            <span>▲{val || ""}</span>
          </span>
        );
      case "down":
        return (
          <span className="flex items-center gap-0.5 text-rose-500 font-bold text-xs">
            <TrendingDown className="w-3.5 h-3.5 shrink-0" />
            <span>▼{val || ""}</span>
          </span>
        );
      case "new":
        return (
          <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase">
            Nouveau
          </span>
        );
      default:
        return (
          <span className="text-slate-400 flex items-center justify-center">
            <Minus className="w-3.5 h-3.5" />
          </span>
        );
    }
  };

  const currentStudentsList = activeTab === "national" ? nationalStudents : nigeriaStudents;

  // Sorting logic
  const sortedStudents = [...currentStudentsList].sort((a, b) => {
    if (sortBy === "blitz") {
      const aVal = parseInt(a.blitz.split("/")[0]) || 0;
      const bVal = parseInt(b.blitz.split("/")[0]) || 0;
      return bVal - aVal;
    }
    return b.xp - a.xp;
  });

  // Filter with query
  const filteredStudents = sortedStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSchools = schoolsData.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Top 3 for Podium (when not in School mode)
  const podiumTop3 = sortedStudents.slice(0, 3);
  const podium1 = podiumTop3[0];
  const podium2 = podiumTop3[1];
  const podium3 = podiumTop3[2];

  const handleRegisterBlitz = () => {
    setIsRegisteredForBlitz(true);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-800 antialiased">
      
      {/* Navigation Header Bar */}
      <div className="bg-white border-b border-slate-100 py-3.5 px-4 sticky top-0 z-40 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentView("dashboard")}
            className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 hover:text-brand-blue transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Tableau de Bord</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#FFFCE8] border border-[#FFEB85] text-[#A67C00] px-3 py-1 rounded-full text-xs font-black">
              <Star className="w-3.5 h-3.5 fill-[#FFD214] text-[#FFD214]" />
              <span>{userXP} XP</span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-full text-xs font-black">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{userStreak} Jours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 pt-8">
        
        {/* Page title & sub */}
        <div className="mb-8">
          <h1 className="font-display font-black text-2xl md:text-3xl text-brand-blue flex items-center gap-2 tracking-tight">
            <span>🏆</span>
            <span>Classement {activeTab === "school" ? "des Écoles" : activeTab === "nigeria" ? "du Nigeria" : "National"}</span>
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-semibold mt-1">
            Cohorte 1 • Semaine 2 • Mis à jour en temps réel
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT/CENTER MAIN COLUMN */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* PERSISTENT USER POSITION CARD */}
            <div className="bg-white border-2 border-amber-400 rounded-3xl p-5 md:p-6 shadow-[0_8px_30px_rgb(245,197,24,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-amber-400 text-[#002B5B] font-black text-[9px] uppercase tracking-widest rounded-bl-xl">
                Votre Rang
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-brand-blue border-4 border-amber-100/40 flex items-center justify-center text-white font-display font-black text-lg">
                    {userFullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-brand-blue w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shadow-md border-2 border-white">
                    5
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-black text-base text-slate-800 leading-tight">
                    {userFullName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-slate-500">
                    <span className="text-emerald-600 flex items-center gap-0.5 font-bold">
                      <TrendingUp className="w-3.5 h-3.5" /> ▲ 3 positions
                    </span>
                    <span>•</span>
                    <span>Nigeria 🇳🇬</span>
                  </div>
                </div>
              </div>

              {/* Stats group */}
              <div className="grid grid-cols-3 gap-6 pt-3 md:pt-0 border-t border-slate-100 md:border-t-0 md:pl-6">
                <div className="text-center md:text-left">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">XP Total</p>
                  <p className="font-display font-black text-lg text-amber-500 mt-0.5">{userXP}</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Série d'études</p>
                  <p className="font-display font-black text-lg text-brand-blue mt-0.5">{userStreak} J 🔥</p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Précision Blitz</p>
                  <p className="font-display font-black text-lg text-indigo-600 mt-0.5">73%</p>
                </div>
              </div>

            </div>

            {/* TAB SELECTION AND SEARCH */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-1">
              <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
                {[
                  { id: "national", label: "🌍 National" },
                  { id: "nigeria", label: "🇳🇬 Nigeria" },
                  { id: "school", label: "🏫 Mon École" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setVisibleCount(6);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-white text-brand-blue shadow-xs"
                        : "text-slate-500 hover:text-brand-blue"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                {/* Search input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8.5 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                  />
                </div>

                {activeTab !== "school" && (
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white border border-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-brand-blue"
                  >
                    <option value="xp">XP Total</option>
                    <option value="blitz">Blitz Score</option>
                  </select>
                )}
              </div>
            </div>

            {/* PODIUM SECTION (only shown when not on School tab and query is empty) */}
            {activeTab !== "school" && !searchQuery && (
              <div className="grid grid-cols-3 gap-3 md:gap-6 pt-10 pb-4 max-w-xl mx-auto items-end">
                
                {/* 2nd Place (Left) */}
                {podium2 && (
                  <div 
                    className="flex flex-col items-center group cursor-pointer"
                    onClick={() => setSelectedStudent(podium2)}
                  >
                    <div className="relative mb-3">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-slate-200 overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300">
                        <img 
                          src={podium2.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuB1-d54NRyl9Ump_Ed7615rQjNP5BEcSrQL-pQp4i0YV0gHp9NfjU4a1DfwBZcmsPn36BOhwgGyvL-saf_DyJGh3MOsSmLl0pJ08T-t9xukqWYnqIxLwsb6r3Eq-PvYBYWExtaHHJvih5UzHZtH2U6xLHfNz3j-0qGvcp32Gaa6sLA5sYWxKOEDrBxj7O4fvFIVUYoddGyNWaYYi0ZifCc782X5uSjRL9cxBevHtCh4dCzUS-Py44755g"} 
                          alt={podium2.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-slate-200 text-slate-800 w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] md:text-xs shadow-sm border-2 border-white">
                        🥈
                      </div>
                    </div>
                    <p className="font-display font-black text-xs text-slate-700 text-center leading-tight">
                      {podium2.name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{podium2.flag} {podium2.country}</p>
                    
                    {/* Pedestal */}
                    <div className="w-20 md:w-24 bg-slate-100 rounded-t-2xl shadow-xs flex flex-col items-center justify-center py-4 mt-3 h-24 md:h-28 border border-slate-200/50">
                      <p className="font-display font-black text-base text-slate-700">{podium2.xp}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">XP</p>
                    </div>
                  </div>
                )}

                {/* 1st Place (Center - elevated) */}
                {podium1 && (
                  <div 
                    className="flex flex-col items-center group cursor-pointer -translate-y-4"
                    onClick={() => setSelectedStudent(podium1)}
                  >
                    <div className="relative mb-3">
                      {/* Bouncing Crown Overlay */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 animate-bounce">
                        <Award className="w-7 h-7 text-amber-500 fill-amber-400" />
                      </div>
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-amber-400 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300 ring-4 ring-amber-100">
                        <img 
                          src={podium1.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCa4vuvgeb5RvEHwrvTNag6MNWdUJw55m1ooZ2XCVUtkPMZqeJ2zx5obdf6EX6-1tsTdsxglPxkKd0215HYFRvwoty0ZhWsW8BRTvfCaszXffDet9aqvL6ovrWvwwhtru1IOtctjhMeGwIAf3EPBHKJa8A5wULHaUGQIm3dVwQccOT0dVbZqWXVzWmUTx1NvAtKmNxIHEmsOBoGjqH6_zOTdN8lPeMkvFBavxV2oeFMNxxvCp7ayYGldA"} 
                          alt={podium1.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow-md border-2 border-white">
                        🥇
                      </div>
                    </div>
                    <p className="font-display font-black text-sm text-brand-blue text-center leading-tight">
                      {podium1.name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{podium1.flag} {podium1.country}</p>
                    
                    {/* Pedestal */}
                    <div className="w-24 md:w-28 bg-[#002B5B] text-white rounded-t-2xl shadow-md flex flex-col items-center justify-center py-5 mt-3 h-32 md:h-36 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,#fff_25%,transparent_25%,transparent_50%,#fff_50%,#fff_75%,transparent_75%,transparent)] bg-[size:16px_16px]" />
                      <p className="font-display font-black text-lg md:text-xl text-amber-300 relative z-10">{podium1.xp}</p>
                      <p className="text-[8px] font-black text-amber-200/80 uppercase tracking-wider relative z-10">Record XP</p>
                    </div>
                  </div>
                )}

                {/* 3rd Place (Right) */}
                {podium3 && (
                  <div 
                    className="flex flex-col items-center group cursor-pointer"
                    onClick={() => setSelectedStudent(podium3)}
                  >
                    <div className="relative mb-3">
                      <div className="w-16 h-16 md:w-18 md:h-18 rounded-full border-4 border-orange-200 overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300">
                        <img 
                          src={podium3.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBMbf5eeXY6r6B1k6OYS52TnH5Ab_3bCWWrak4rFyzncoAUG2oU4Zum5bnJyDEnCB27XDZoiHjXHltdbx8gsXuHrr6FKpqNnDJTol3W4xERDqm4lYc0PpMhfGBLNKDKnXZZzrwgHVkpwXImZKsqy76mxI-o0TYVzucrlPPfhzOCuQrtMSD3Pita71O_S8GfOFb0753tdTouVXdfkdXJ583rqpdmhQRYguEnJUftpuTIxmKplghS-DCCew"} 
                          alt={podium3.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-orange-100 text-orange-800 w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] md:text-xs shadow-sm border-2 border-white">
                        🥉
                      </div>
                    </div>
                    <p className="font-display font-black text-xs text-slate-700 text-center leading-tight">
                      {podium3.name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{podium3.flag} {podium3.country}</p>
                    
                    {/* Pedestal */}
                    <div className="w-20 md:w-24 bg-slate-50 rounded-t-2xl shadow-xs flex flex-col items-center justify-center py-4 mt-3 h-20 md:h-24 border border-slate-200/40">
                      <p className="font-display font-black text-base text-slate-600">{podium3.xp}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">XP</p>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* MAIN LEADERBOARD TABLE */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                {activeTab === "school" ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-mono text-[10px] font-bold uppercase tracking-wider border-b border-slate-150">
                        <th className="py-3.5 px-6">Rang</th>
                        <th className="py-3.5 px-6">École</th>
                        <th className="py-3.5 px-6">Pays</th>
                        <th className="py-3.5 px-6">Étudiants</th>
                        <th className="py-3.5 px-6">Moy. XP</th>
                        <th className="py-3.5 px-6 text-right">Top Étudiant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                      {filteredSchools.map((sch) => (
                        <tr 
                          key={sch.name}
                          className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                        >
                          <td className="py-4 px-6 font-display font-black text-slate-800 text-sm">
                            {sch.rank}
                          </td>
                          <td className="py-4 px-6 text-brand-blue font-bold">
                            {sch.name}
                          </td>
                          <td className="py-4 px-6 font-medium text-slate-500">
                            {sch.country}
                          </td>
                          <td className="py-4 px-6 text-slate-500">
                            {sch.students}
                          </td>
                          <td className="py-4 px-6 font-display font-black text-amber-500 text-sm">
                            {sch.avgXp} XP
                          </td>
                          <td className="py-4 px-6 text-right text-slate-800">
                            {sch.topStudent}
                          </td>
                        </tr>
                      ))}
                      {filteredSchools.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                            Aucune école trouvée pour "{searchQuery}"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-mono text-[10px] font-bold uppercase tracking-wider border-b border-slate-150">
                        <th className="py-3.5 px-6">Rang</th>
                        <th className="py-3.5 px-6">Étudiant</th>
                        <th className="py-3.5 px-6">Pays</th>
                        <th className="py-3.5 px-6">XP</th>
                        <th className="py-3.5 px-6">Blitz</th>
                        <th className="py-3.5 px-6 text-right">Série</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                      {filteredStudents.slice(0, visibleCount).map((row) => (
                        <tr 
                          key={row.name}
                          onClick={() => setSelectedStudent(row)}
                          className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                            row.isUser 
                              ? "bg-amber-400/5 border-l-4 border-amber-400" 
                              : ""
                          }`}
                        >
                          {/* Rank */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <span className={`font-display font-black text-sm ${
                                row.isUser ? "text-brand-blue" : "text-slate-800"
                              } w-4`}>
                                {row.rank}
                              </span>
                              {renderDiffIndicator(row.diff, row.diffVal)}
                            </div>
                          </td>

                          {/* Student Name */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {row.avatar ? (
                                <img 
                                  src={row.avatar} 
                                  alt={row.name} 
                                  className="w-8 h-8 rounded-full object-cover border border-slate-100 shrink-0" 
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-brand-blue font-bold text-[10px] shrink-0">
                                  {row.name.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div className="flex items-center gap-1.5">
                                <span className={`font-bold ${row.isUser ? "text-brand-blue font-extrabold" : "text-slate-800"}`}>
                                  {row.name}
                                </span>
                                {row.isUser && (
                                  <span className="px-1.5 py-0.5 bg-brand-blue text-white text-[8px] font-black rounded-sm uppercase tracking-wider">
                                    Vous
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Country */}
                          <td className="py-4 px-6 font-medium text-slate-500">
                            <span className="mr-1">{row.flag}</span> {row.country}
                          </td>

                          {/* XP */}
                          <td className="py-4 px-6">
                            <span className="font-display font-black text-amber-500 text-sm">
                              {row.xp}
                            </span>
                          </td>

                          {/* Blitz Score */}
                          <td className="py-4 px-6 font-mono text-xs font-bold text-indigo-600">
                            {row.blitz}
                          </td>

                          {/* Streak */}
                          <td className="py-4 px-6 text-right font-bold text-slate-800">
                            {row.streak}
                          </td>
                        </tr>
                      ))}
                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                            Aucun participant trouvé pour "{searchQuery}"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Load More Button */}
              {activeTab !== "school" && filteredStudents.length > visibleCount && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 6)}
                    className="text-brand-blue hover:text-brand-blue-light font-extrabold text-xs uppercase tracking-wider cursor-pointer hover:underline"
                  >
                    Charger plus de participants...
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDEBAR PANEL */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Cohort Stats Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <h3 className="font-display font-black text-xs uppercase tracking-wider text-slate-400 mb-4">
                Stats de la Cohorte
              </h3>

              <div className="space-y-4 text-xs font-semibold">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500">Total Étudiants</span>
                  <span className="font-black text-slate-800">4,200</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500">Pays Leader</span>
                  <span className="font-black text-slate-800">Nigeria 🇳🇬</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500">XP Moyen</span>
                  <span className="font-black text-brand-blue">412 XP</span>
                </div>
              </div>
            </div>

            {/* Blitz Countdown Promotional Widget */}
            <div className="bg-brand-blue text-white rounded-3xl p-6 shadow-lg relative overflow-hidden group">
              {/* Abstract decorative shape */}
              <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-white/5 rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
              
              <div className="flex items-center gap-1.5 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Le Blitz d'Académie</span>
              </div>
              
              <h3 className="font-display font-black text-lg text-white mt-1.5 leading-snug">
                Prochain Examen National
              </h3>
              
              {/* Countdown timer bubbles */}
              <div className="grid grid-cols-2 gap-2 my-5">
                <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 text-center">
                  <p className="font-display font-black text-lg text-amber-300 leading-none">02</p>
                  <p className="text-[8px] font-black uppercase tracking-wider text-slate-200 mt-1">Jours</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 text-center">
                  <p className="font-display font-black text-lg text-amber-300 leading-none">14</p>
                  <p className="text-[8px] font-black uppercase tracking-wider text-slate-200 mt-1">Heures</p>
                </div>
              </div>

              {isRegisteredForBlitz ? (
                <div className="w-full bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider py-3 px-4 rounded-xl text-center flex items-center justify-center gap-1.5">
                  <UserCheck className="w-4 h-4 stroke-[3]" />
                  <span>Inscrit avec succès !</span>
                </div>
              ) : (
                <button 
                  onClick={handleRegisterBlitz}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-brand-blue font-black text-xs uppercase tracking-widest py-3 px-4 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  S'inscrire à l'examen
                </button>
              )}
            </div>

          </div>

        </div>

      </main>

      {/* DETAILED STUDENT POPUP MODAL */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" 
              onClick={() => setSelectedStudent(null)} 
            />

            {/* Popup Card */}
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl overflow-hidden relative z-10 shadow-2xl border border-slate-100"
            >
              {/* Close Button */}
              <button 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100/80 p-1.5 rounded-full z-15 cursor-pointer transition-colors"
                onClick={() => setSelectedStudent(null)}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Cover Banner */}
              <div className="bg-slate-50 h-20 w-full relative border-b border-slate-100" />

              {/* Avatar position offset */}
              <div className="px-6 pb-6 relative">
                <div className="absolute -top-10 left-6">
                  {selectedStudent.avatar ? (
                    <img 
                      src={selectedStudent.avatar} 
                      alt={selectedStudent.name} 
                      className="w-18 h-18 rounded-full border-4 border-white shadow-md object-cover"
                    />
                  ) : (
                    <div className="w-18 h-18 rounded-full bg-brand-blue text-white border-4 border-white shadow-md flex items-center justify-center font-display font-black text-xl">
                      {selectedStudent.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="pt-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-display font-black text-lg text-slate-800">
                        {selectedStudent.name}
                      </h2>
                      <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-wide">
                        {selectedStudent.school || "Lycée Partenaire d'Afrique"}
                      </p>
                    </div>
                    <span className="text-2xl" title={selectedStudent.country}>{selectedStudent.flag}</span>
                  </div>

                  {/* Profile info cards */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Score d'étude</p>
                      <p className="font-display font-black text-base text-amber-500 mt-0.5">{selectedStudent.xp} XP</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Série actuelle</p>
                      <p className="font-display font-black text-base text-brand-blue mt-0.5">{selectedStudent.streak}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl col-span-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Dernier score Blitz</p>
                      <p className="font-display font-black text-xs text-indigo-600 mt-0.5">Score parfait : {selectedStudent.blitz}</p>
                    </div>
                  </div>

                  {/* Call to action */}
                  <button 
                    onClick={() => {
                      setSelectedStudent(null);
                      setCurrentView("profile");
                    }}
                    className="w-full mt-6 border-2 border-brand-blue hover:bg-brand-blue hover:text-white text-brand-blue font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer text-center block"
                  >
                    Voir mon Profil
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-850 animate-slide-up">
          <div className="bg-emerald-500 text-white p-1 rounded-lg">
            <UserCheck className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <p className="text-xs font-bold">Inscription confirmée !</p>
            <p className="text-[10px] font-semibold text-slate-400">Vous recevrez un rappel par email avant le début.</p>
          </div>
        </div>
      )}

    </div>
  );
}
