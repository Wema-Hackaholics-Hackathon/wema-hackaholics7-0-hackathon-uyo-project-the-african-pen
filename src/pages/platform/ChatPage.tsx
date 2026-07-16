import React from 'react'
import { useNavigate } from 'react-router-dom'
import AiTutorChat from '../../components/AiTutorChat'

export default function ChatPage() {
  const navigate = useNavigate()

  return (
    <div className="w-full">
      <AiTutorChat />
    </div>
  )
}
