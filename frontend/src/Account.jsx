import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { dashboardPath, useAuth } from './auth'
import { errorMessage } from './api'
import { Notice } from './components'

export function Protected({ role, children }) {
  const { user, loading, sessionError, retry } = useAuth()
  const location = useLocation()
  if (loading) return <div className="container section-space" role="status">Checking session…</div>
  if (sessionError) return <div className="container section-space"><Notice error={sessionError} /><button className="btn btn-primary" onClick={retry}>Try again</button></div>
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (user.role !== role) return <Navigate to="/unauthorized" replace />
  return children
}

export function Account({ register = false }) {
  const { user, signIn, loading } = useAuth()
  const { state } = useLocation()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (loading) return <div className="container section-space" role="status">Checking session…</div>
  if (user) {
    const dashboard = dashboardPath(user)
    const from = state?.from
    const destination = typeof from === 'string' && from.startsWith('/courses/') ? from : dashboard
    return <Navigate to={destination} replace />
  }

  async function submit(event) {
    event.preventDefault()
    const form = Object.fromEntries(new FormData(event.currentTarget))
    setBusy(true)
    setError('')
    try {
      await signIn(register ? '/register' : '/login', form)
    } catch (error) {
      setError(errorMessage(error))
      setBusy(false)
    }
  }

  return <section className="container section-space">
    <div className="panel auth-panel"><div className="page-heading"><h1>{register ? 'Create your account' : 'Welcome back'}</h1>
      <p>{register ? 'Join LearnHub as a student or instructor.' : 'Sign in to your LearnHub account.'}</p></div>
      <Notice error={error} />
      <form className="form-stack" onSubmit={submit}>
        {register && <label>Full name<input className="form-control" name="name" required maxLength={100} autoComplete="name" /></label>}
        <label>Email address<input className="form-control" name="email" required type="email" maxLength={254} autoComplete="email" /></label>
        <label>Password<input className="form-control" name="password" required type="password" minLength={register ? 8 : undefined} maxLength={72} autoComplete={register ? 'new-password' : 'current-password'} /></label>
        {register && <label>Account type<select className="form-select" name="role"><option value="student">Student</option><option value="instructor">Instructor</option></select></label>}
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Please wait…' : register ? 'Create account' : 'Sign in'}</button>
      </form>
      <p className="auth-switch">{register ? 'Already have an account?' : 'New to LearnHub?'}{' '}
        <Link to={register ? '/login' : '/register'} state={state}>{register ? 'Sign in' : 'Create an account'}</Link>
      </p>
    </div>
  </section>
}

export function StatusPage({ unauthorized = false }) {
  const { user } = useAuth()
  return <section className="container section-space status-page">
    <div className="page-heading"><h1>{unauthorized ? 'Access denied' : 'Page not found'}</h1>
      <p>{unauthorized ? 'Your account does not have access to this page.' : 'The page you requested could not be found.'}</p></div>
    <Link className="btn btn-primary" to={user && unauthorized ? dashboardPath(user) : '/'}>{user && unauthorized ? 'Go to dashboard' : 'Go home'}</Link>
  </section>
}
