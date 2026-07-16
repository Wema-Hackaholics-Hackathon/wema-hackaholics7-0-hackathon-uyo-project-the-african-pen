import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LessonViewer from '../../components/LessonViewer'
import { useAuthStore } from '../../stores/authStore'

export default function LessonPage() {
  const navigate = useNavigate()
  const { id: lessonId } = useParams()
  const { user, updateXP } = useAuthStore()

  const handleSetCurrentView = (view: string) => {
    if (view === 'parcours') navigate('/parcours')
    else if (view === 'dashboard') navigate('/dashboard')
    else if (view === 'landing') navigate('/')
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
    <LessonViewer
      userXP={user?.xp ?? 680}
      userStreak={user?.streak ?? 12}
      setCurrentView={handleSetCurrentView}
      onGainXP={(amount) => updateXP(amount)}
    />
  )
}
