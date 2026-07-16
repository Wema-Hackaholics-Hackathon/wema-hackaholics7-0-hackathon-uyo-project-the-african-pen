import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, ArrowRight } from 'lucide-react'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length === 6) {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-lg border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-amber-400 to-brand-coral" />
        
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-blue mx-auto mb-6 shadow-sm">
            <KeyRound className="w-8 h-8 text-brand-blue" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#002B5B] font-display tracking-tight">
            Vérifiez votre email
          </h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Nous vous avons envoyé un code de validation à 6 chiffres. Veuillez le saisir ci-dessous.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div className="rounded-md shadow-xs">
            <div>
              <input
                id="verification-code"
                name="code"
                type="text"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="appearance-none relative block w-full px-5 py-4 border-2 border-slate-100 placeholder-slate-300 text-slate-800 rounded-2xl focus:outline-hidden focus:ring-0 focus:border-brand-blue font-mono text-center text-2xl tracking-[0.5em] font-extrabold transition-all"
                placeholder="000000"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={code.length !== 6}
              className={`group relative w-full flex justify-center py-4 px-6 border border-transparent text-sm font-extrabold rounded-2xl text-white shadow-md transition-all ${
                code.length === 6
                  ? 'bg-[#002B5B] hover:bg-blue-800 hover:-translate-y-0.5 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Vérifier l'adresse email
              <ArrowRight className="w-4 h-4 ml-2 mt-0.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
