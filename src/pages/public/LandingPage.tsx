import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../../components/Hero'
import QuizWidget from '../../components/QuizWidget'
import Pricing from '../../components/Pricing'
import FAQ from '../../components/FAQ'
import { useAuthStore } from '../../stores/authStore'

export default function LandingPage() {
  const navigate = useNavigate()
  const { updateXP, updateStreak } = useAuthStore()
  const [language, setLanguage] = useState<'en' | 'fr'>('en')

  const toggleLanguage = () => setLanguage(prev => (prev === 'en' ? 'fr' : 'en'))

  const handleGainXP = (amount: number) => {
    updateXP(amount)
  }

  const handleIncrementStreak = () => {
    if (useAuthStore.getState().user) {
      updateStreak(useAuthStore.getState().user!.streak + 1)
    }
  }

  return (
    <div className="w-full">
      <Hero 
        setCurrentView={(view) => {
          if (view === 'signup') navigate('/register')
          else if (view === 'login') navigate('/login')
        }} 
        openSignupModal={() => navigate('/register')}
        language={language}
        onLanguageToggle={toggleLanguage}
      />

      <div className="w-full bg-slate-50 border-t border-slate-100 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-coral block font-mono">Démo Interactive</span>
            <h3 className="font-display text-2xl font-black text-[#002B5B] mt-1">Tester l'expérience La Plume</h3>
            <p className="text-slate-500 text-sm mt-1">Pratiquez avec notre outil réel d'examen ci-dessous.</p>
          </div>
          <QuizWidget 
            onGainXP={handleGainXP} 
            incrementStreak={handleIncrementStreak} 
          />
        </div>
      </div>

      <Pricing openSignupModal={() => navigate('/register')} />
      <FAQ />
    </div>
  )
}
