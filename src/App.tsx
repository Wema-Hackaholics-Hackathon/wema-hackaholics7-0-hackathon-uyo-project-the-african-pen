/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Flame } from "lucide-react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import QuizWidget from "./components/QuizWidget";
import DashboardWidget from "./components/DashboardWidget";
import AiValidationWidget from "./components/AiValidationWidget";
import AiTutorChat from "./components/AiTutorChat";
import FAQ from "./components/FAQ";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";
import SignupView from "./components/SignupView";
import OnboardingView from "./components/OnboardingView";
import PlanSelectionView from "./components/PlanSelectionView";
import ParcoursView from "./components/ParcoursView";
import LessonViewer from "./components/LessonViewer";
import BlitzArena from "./components/BlitzArena";
import ExamsView from "./components/ExamsView";
import ProfileView from "./components/ProfileView";
import RankingView from "./components/RankingView";
import LaLettre from "./components/LaLettre";
import LaTraduction from "./components/LaTraduction";
import LaDebat from "./components/LaDebat";
import LaOral from "./components/LaOral";
import MesCours from "./components/MesCours";

export default function App() {
  const [currentView, setCurrentView] = useState<string>("landing");
  const [userXP, setUserXP] = useState<number>(680); // Initial XP matches screenshot
  const [userStreak, setUserStreak] = useState<number>(12); // Initial streak matches screenshot
  const [registeredName, setRegisteredName] = useState<string>("Johnfavour");
  const [isPremium, setIsPremium] = useState<boolean>(false);

  const handleGainXP = (amount: number) => {
    setUserXP(prev => prev + amount);
  };

  const incrementStreak = () => {
    setUserStreak(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans selection:bg-brand-blue selection:text-white">
      
      {/* Navigation Header */}
      {currentView !== "onboarding" && currentView !== "dashboard" && currentView !== "parcours" && currentView !== "lesson-viewer" && currentView !== "mes-cours" && currentView !== "blitz" && currentView !== "exams" && currentView !== "profile" && currentView !== "ranking" && currentView !== "la-lettre" && currentView !== "la-traduction" && currentView !== "la-debat" && currentView !== "la-oral" && (
        <Header 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          openSignupModal={() => setCurrentView("signup")}
        />
      )}

      {/* Main Content Sections */}
      <main className="flex-grow w-full">
        {currentView === "landing" && (
          <div className="w-full">
            {/* Landing Hero */}
            <Hero 
              setCurrentView={setCurrentView} 
              openSignupModal={() => setCurrentView("signup")} 
            />

            {/* Inline Quick Teaser Widgets to spark engagement */}
            <div className="w-full bg-slate-50 border-t border-slate-100 py-16">
              <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-10">
                  <span className="text-xs font-bold uppercase tracking-widest text-brand-coral block font-mono">Démo Interactive</span>
                  <h3 className="font-display text-2xl font-black text-brand-blue mt-1">Tester l'expérience La Plume</h3>
                  <p className="text-slate-500 text-sm mt-1">Pratiquez avec notre outil réel d'examen ci-dessous.</p>
                </div>
                <QuizWidget 
                  onGainXP={handleGainXP} 
                  incrementStreak={incrementStreak} 
                />
              </div>
            </div>

            {/* Pricing Offer */}
            <Pricing openSignupModal={() => setCurrentView("signup")} />

            {/* FAQ Accordions */}
            <FAQ />
          </div>
        )}

        {(currentView === "signup" || currentView === "login") && (
          <div className="w-full">
            <SignupView 
              setCurrentView={setCurrentView}
              initialMode={currentView === "login" ? "login" : "signup"}
              onSignupSuccess={(name) => {
                setRegisteredName(name);
                setUserXP(prev => prev + 150);
                setCurrentView("plan-selection");
              }}
            />
          </div>
        )}

        {currentView === "plan-selection" && (
          <div className="w-full">
            <PlanSelectionView 
              userFullName={registeredName}
              onSelectFreeTrial={() => {
                setIsPremium(false);
                setCurrentView("onboarding");
              }}
              onSelectPremiumSuccess={() => {
                setIsPremium(true);
                setCurrentView("onboarding");
              }}
            />
          </div>
        )}

        {currentView === "onboarding" && (
          <div className="w-full">
            <OnboardingView 
              onSignupSuccess={(name) => {
                setRegisteredName(name);
                setCurrentView("dashboard");
              }}
              userFullName={registeredName}
            />
          </div>
        )}

        {currentView === "dashboard" && (
          <div className="w-full">
            <DashboardWidget 
              userXP={userXP} 
              userStreak={userStreak} 
              setCurrentView={setCurrentView}
              isPremium={isPremium}
              userFullName={registeredName}
            />
          </div>
        )}

        {currentView === "parcours" && (
          <div className="w-full">
            <ParcoursView 
              userXP={userXP} 
              userStreak={userStreak} 
              setCurrentView={setCurrentView}
              isPremium={isPremium}
            />
          </div>
        )}

        {currentView === "lesson-viewer" && (
          <div className="w-full animate-fade-in">
            <LessonViewer 
              userXP={userXP} 
              userStreak={userStreak} 
              setCurrentView={setCurrentView}
              onGainXP={handleGainXP}
            />
          </div>
        )}

        {currentView === "quiz" && (
          <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono font-bold uppercase px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                Défis Quotidiens
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-brand-blue tracking-tight mt-2">
                Pratique d'Examen Interactive
              </h2>
            </div>
            <QuizWidget 
              onGainXP={handleGainXP} 
              incrementStreak={incrementStreak} 
            />
          </div>
        )}

        {currentView === "validation" && (
          <div className="w-full">
            <AiValidationWidget onGainXP={handleGainXP} />
          </div>
        )}

        {currentView === "blitz" && (
          <div className="w-full">
            <BlitzArena 
              userXP={userXP} 
              userStreak={userStreak} 
              setCurrentView={setCurrentView}
              onGainXP={handleGainXP}
              isPremium={isPremium}
            />
          </div>
        )}

        {currentView === "exams" && (
          <div className="w-full">
            <ExamsView 
              userXP={userXP} 
              userStreak={userStreak} 
              setCurrentView={setCurrentView}
              onGainXP={handleGainXP}
              isPremium={isPremium}
            />
          </div>
        )}

        {currentView === "chat" && (
          <div className="w-full">
            <AiTutorChat />
          </div>
        )}

        {currentView === "profile" && (
          <div className="w-full animate-fade-in">
            <ProfileView 
              userXP={userXP} 
              userStreak={userStreak} 
              setCurrentView={setCurrentView}
              isPremium={isPremium}
              userFullName={registeredName}
            />
          </div>
        )}

        {currentView === "ranking" && (
          <div className="w-full animate-fade-in">
            <RankingView 
              userXP={userXP} 
              userStreak={userStreak} 
              setCurrentView={setCurrentView}
              isPremium={isPremium}
              userFullName={registeredName}
            />
          </div>
        )}

        {currentView === "la-lettre" && (
          <div className="w-full animate-fade-in">
            <LaLettre 
              userXP={userXP} 
              userStreak={userStreak} 
              setCurrentView={setCurrentView}
              onGainXP={handleGainXP}
              isPremium={isPremium}
              userFullName={registeredName}
            />
          </div>
        )}

        {currentView === "la-traduction" && (
          <div className="w-full animate-fade-in">
            <LaTraduction 
              userXP={userXP} 
              userStreak={userStreak} 
              setCurrentView={setCurrentView}
              onGainXP={handleGainXP}
              isPremium={isPremium}
              userFullName={registeredName}
            />
          </div>
        )}

        {currentView === "la-debat" && (
          <div className="w-full animate-fade-in">
            <LaDebat 
              userXP={userXP} 
              userStreak={userStreak} 
              setCurrentView={setCurrentView}
              onGainXP={handleGainXP}
              isPremium={isPremium}
              userFullName={registeredName}
            />
          </div>
        )}

        {currentView === "la-oral" && (
          <div className="w-full animate-fade-in">
            <LaOral 
              userXP={userXP} 
              userStreak={userStreak} 
              setCurrentView={setCurrentView}
              onGainXP={handleGainXP}
              isPremium={isPremium}
              userFullName={registeredName}
            />
          </div>
        )}

        {currentView === "mes-cours" && (
          <div className="w-full animate-fade-in">
            <MesCours 
              userXP={userXP} 
              userStreak={userStreak} 
              setCurrentView={setCurrentView}
              onGainXP={handleGainXP}
              isPremium={isPremium}
              userFullName={registeredName}
            />
          </div>
        )}
      </main>

      {/* Persistent Beautiful Footer */}
      {currentView !== "signup" && currentView !== "login" && currentView !== "onboarding" && currentView !== "plan-selection" && currentView !== "parcours" && currentView !== "lesson-viewer" && currentView !== "mes-cours" && currentView !== "dashboard" && currentView !== "blitz" && currentView !== "exams" && currentView !== "profile" && currentView !== "ranking" && currentView !== "la-lettre" && currentView !== "la-traduction" && currentView !== "la-debat" && currentView !== "la-oral" && (
        <Footer 
          setCurrentView={setCurrentView} 
          openSignupModal={() => setCurrentView("signup")} 
        />
      )}

    </div>
  );
}
