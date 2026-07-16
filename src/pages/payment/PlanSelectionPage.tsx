import React from 'react'
import { useNavigate } from 'react-router-dom'
import PlanSelectionView from '../../components/PlanSelectionView'
import { useAuthStore } from '../../stores/authStore'

export default function PlanSelectionPage() {
  const navigate = useNavigate()
  const { user, setIsPremium } = useAuthStore()

  const handleSelectFreeTrial = () => {
    setIsPremium(false)
    navigate('/onboarding')
  }

  const handleSelectPremiumSuccess = () => {
    setIsPremium(true)
    navigate('/payment')
  }

  return (
    <PlanSelectionView 
      userFullName={user?.name || "Johnfavour"}
      onSelectFreeTrial={handleSelectFreeTrial}
      onSelectPremiumSuccess={handleSelectPremiumSuccess}
    />
  )
}
