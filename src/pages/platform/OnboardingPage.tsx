import React from 'react'
import { useNavigate } from 'react-router-dom'
import OnboardingView from '../../components/OnboardingView'
import { useAuthStore } from '../../stores/authStore'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, setOnboardingComplete } = useAuthStore()

  const handleSignupSuccess = (name: string) => {
    setOnboardingComplete(true)
    navigate('/dashboard')
  }

  return (
    <div className="w-full">
      <OnboardingView 
        onSignupSuccess={handleSignupSuccess}
        userFullName={user?.name ?? "Johnfavour"}
      />
    </div>
  )
}
