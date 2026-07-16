import React from 'react'
import { useNavigate } from 'react-router-dom'
import AiValidationWidget from '../../components/AiValidationWidget'
import { useAuthStore } from '../../stores/authStore'

export default function ValidationPage() {
  const navigate = useNavigate()
  const { updateXP } = useAuthStore()

  const handleGainXP = (amount: number) => {
    updateXP(prev => prev + amount)
  }

  return (
    <div className="w-full">
      <AiValidationWidget onGainXP={handleGainXP} />
    </div>
  )
}
