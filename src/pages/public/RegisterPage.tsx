import React from 'react'
import { useNavigate } from 'react-router-dom'
import SignupView from '../../components/SignupView'
import { useAuthStore } from '../../stores/authStore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setUser, setToken } = useAuthStore()

  const handleSignupSuccess = (name: string) => {
    setUser({
      id: "1",
      name: name || "Johnfavour",
      email: `${name.toLowerCase()}@laplume.africa`,
      country: "🇳🇬 Nigeria",
      school: "La Plume High School",
      cohortId: "cohort_1",
      level: 3,
      xp: 830, // 680 + 150 XP bonus for signing up
      streak: 12,
      isPremium: false,
      trialExpired: false,
      onboardingComplete: false, // forces onboarding
      rank: 4
    })
    setToken("mock-register-token")
    navigate('/plan-selection')
  }

  return (
    <SignupView 
      setCurrentView={(view) => {
        if (view === 'login') navigate('/login')
        else if (view === 'landing') navigate('/')
      }}
      initialMode="signup"
      onSignupSuccess={handleSignupSuccess}
    />
  )
}
