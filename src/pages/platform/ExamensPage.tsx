import React from 'react'
import { useNavigate } from 'react-router-dom'
import ExamsView from '../../components/ExamsView'
import { useAuthStore } from '../../stores/authStore'

export default function ExamensPage() {
  const navigate = useNavigate()
  const { user, updateXP } = useAuthStore()

  const handleSetCurrentView = (view: string) => {
    if (view === 'dashboard') navigate('/dashboard')
    else if (view === 'parcours') navigate('/parcours')
    else if (view === 'landing') navigate('/')
    else if (view === 'results') navigate('/examens/results')
    else if (view === 'blitz') navigate('/blitz')
    else if (view === 'quiz') navigate('/quiz')
    else if (view === 'validation') navigate('/validation')
    else if (view === 'chat') navigate('/chat')
    else if (view === 'profile') navigate('/profil')
    else if (view === 'ranking' || view === 'classement') navigate('/classement')
    else if (view === 'mes-cours') navigate('/mes-cours')
    else if (view === 'la-lettre') navigate('/projets/la-lettre')
    else if (view === 'la-traduction') navigate('/projets/la-traduction')
    else if (view === 'la-debat') navigate('/projets/la-debat')
    else if (view === 'la-oral') navigate('/projets/la-oral')
    else if (view === 'onboarding') navigate('/onboarding')
    else if (view === 'plan-selection') navigate('/plan-selection')
    else if (view === 'lesson-viewer') navigate('/cours/l1')
    else if (view === 'exams') navigate('/examens')
  }

  return (
    <ExamsView
      userXP={user?.xp ?? 680}
      userStreak={user?.streak ?? 12}
      isPremium={user?.isPremium ?? false}
      setCurrentView={handleSetCurrentView}
      onGainXP={(amount) => updateXP(amount)}
      hideSidebar={true}
    />
  )
}
