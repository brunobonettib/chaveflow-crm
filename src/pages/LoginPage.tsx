import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { Brand } from '../components/Brand'
import { useAuth } from '../auth/AuthProvider'

export function LoginPage() {
  const { logoutError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (authError) {
        setError(
          authError.code === 'invalid_credentials'
            ? 'E-mail ou senha incorretos. Confira seus dados e tente novamente.'
            : authError.code === 'email_not_confirmed'
              ? 'Seu e-mail ainda não foi confirmado. Entre em contato com o administrador.'
              : 'Não foi possível entrar. Confira seus dados e sua conexão e tente novamente.',
        )
      }
    } catch {
      setError(
        'Não foi possível conectar. Verifique sua conexão e tente novamente.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-layout">
      <section className="login-panel">
        <header className="login-header">
          <Brand />
          <span className="restricted-label">
            <span /> Acesso exclusivo
          </span>
        </header>
        <div className="login-content">
          <p className="eyebrow">SEU PRÓXIMO CAPÍTULO COMEÇA AQUI</p>
          <h1>
            Bom ter você
            <br />
            de volta<span className="accent">.</span>
          </h1>
          <p className="login-description">
            Entre na sua conta para acessar o ambiente
            <br className="desktop-break" /> de trabalho do ChaveFlow CRM.
          </p>
          <form
            onSubmit={handleSubmit}
            className="login-form"
            aria-busy={isSubmitting}
          >
            {logoutError && (
              <p className="error-message" role="alert">
                {logoutError}
              </p>
            )}
            <div className="field">
              <label htmlFor="email">E-mail profissional</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="voce@chaveflow.com.br"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="field">
              <label htmlFor="password">Senha</label>
              <div className="password-field">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    {showPassword && (
                      <path
                        d="m4 3 16 18"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="primary-button login-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" /> Entrando...
                </>
              ) : (
                <>
                  Entrar na plataforma <span aria-hidden="true">↗</span>
                </>
              )}
            </button>
          </form>
          <p className="access-help">
            Precisa de acesso ou esqueceu sua senha?
            <br />
            <span>Entre em contato com o administrador.</span>
          </p>
          <div className="security-note">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="m10 2 6 2.5v5c0 4-6 7-6 7s-6-3-6-7v-5L10 2Z"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path d="m7 9 2 2 4-4" stroke="currentColor" strokeWidth="1.3" />
            </svg>{' '}
            Ambiente seguro. Acesso individual e protegido.
          </div>
        </div>
        <footer className="login-footer">
          <span>© {new Date().getFullYear()} ChaveFlow CRM</span>
          <span>Feito para conectar oportunidades.</span>
        </footer>
      </section>
      <aside
        className="login-showcase"
        aria-label="ChaveFlow CRM, pessoas e oportunidades"
      >
        <div className="showcase-top">
          <span className="showcase-tag">PESSOAS. CONEXÕES. CONQUISTAS.</span>
          <span className="showcase-number">01 / CHAVEFLOW</span>
        </div>
        <div className="architecture" aria-hidden="true" />
        <div className="showcase-copy">
          <span className="showcase-line" />
          <h2>
            Grandes conquistas
            <br />
            começam com uma
            <br />
            <em>boa conexão.</em>
          </h2>
          <p>
            Um lugar para aproximar pessoas
            <br />e construir novas possibilidades.
          </p>
        </div>
        <div className="showcase-bottom">
          <span>CHAVEFLOW · CRM IMOBILIÁRIO</span>
          <span className="showcase-spark" aria-hidden="true">
            ✳
          </span>
        </div>
      </aside>
    </main>
  )
}
