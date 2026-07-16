import React from 'react'
import { useNavigate } from 'react-router-dom'
import SignupView from '../../components/SignupView'
import { useAuthStore } from '../../stores/authStore'

export const LoginPage = () => {
  const navigate = useNavigate()
  const { setUser, setToken } = useAuthStore()

  const handleLoginSuccess = (name: string) => {
    setUser({
      id: "1",
      name: name || "Johnfavour",
      email: `${name.toLowerCase()}@laplume.africa`,
      country: "🇳🇬 Nigeria",
      school: "La Plume High School",
      cohortId: "cohort_1",
      level: 3,
      xp: 680,
      streak: 12,
      isPremium: false,
      trialExpired: false,
      onboardingComplete: true,
      rank: 4
    })
    setToken("mock-login-token")
    navigate('/dashboard')
  }

  return (
    <SignupView 
      setCurrentView={(view) => {
        if (view === 'signup') navigate('/register')
        else if (view === 'landing') navigate('/')
      }}
      initialMode="login"
      onSignupSuccess={handleLoginSuccess}
    />
  )
}

export default LoginPage
