'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function NouveauMotDePassePage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // 🔐 Set session temporaire avec access_token du lien reçu par email
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const access_token = params.get('access_token')
    const type = params.get('type')

    if (access_token && type === 'recovery') {
      supabase.auth.setSession({
        access_token,
        refresh_token: '',
      })

      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth event:', event)
        console.log('Session temporaire:', session)
      })

      return () => {
        authListener.subscription.unsubscribe()
      }
    }
  }, [supabase])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    // Vérification de la sécurité du mot de passe
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (password.length < 12) {
      setError('Le mot de passe doit contenir au moins 12 caractères.')
      return
    }

    if (!hasNumber || !hasSpecialChar) {
      setError('Le mot de passe doit contenir au moins un chiffre et un caractère spécial.')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      setError("Une erreur est survenue. Le lien a peut-être expiré.")
    } else {
      setMessage('Mot de passe mis à jour. Redirection...')
      setTimeout(() => router.push('/connexion'), 3000)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-blue-900">
      <div className="card w-full max-w-sm bg-white shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Nouveau mot de passe
        </h2>

        {message && (
          <div className="alert alert-success shadow-lg mb-4">
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="alert alert-error shadow-lg mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword}>
          <div className="form-control mb-4">
            <label className="label">
              <span>Nouveau mot de passe</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered input-primary w-full"
              required
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span>Confirmer le mot de passe</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered input-primary w-full"
              required
            />
          </div>
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Mise à jour...' : 'Changer le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  )
}
