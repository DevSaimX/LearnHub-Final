import { useEffect, useState } from 'react'
import { api, tokenKey, errorMessage } from './api'
import { AuthContext } from './auth'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(tokenKey)))
  const [sessionError, setSessionError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    function expire() {
      setUser(null)
      setSessionError('')
    }
    window.addEventListener('learnhub-session-expired', expire)
    if (localStorage.getItem(tokenKey)) {
      api.get('/me', { signal: controller.signal }).then(({ data }) => {
        if (!controller.signal.aborted) setUser(data)
      }).catch(error => {
        if (!controller.signal.aborted && error.response?.status !== 401) setSessionError(errorMessage(error))
      }).finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    }
    return () => {
      controller.abort()
      window.removeEventListener('learnhub-session-expired', expire)
    }
  }, [attempt])

  async function signIn(endpoint, input) {
    const { data } = await api.post(endpoint, input)
    localStorage.setItem(tokenKey, data.token)
    setSessionError('')
    setUser(data.user)
    return data.user
  }

  function logout() {
    localStorage.removeItem(tokenKey)
    setSessionError('')
    setUser(null)
  }

  function retry() {
    setSessionError('')
    setLoading(true)
    setAttempt(value => value + 1)
  }

  return <AuthContext.Provider value={{ user, loading, sessionError, retry, signIn, logout }}>{children}</AuthContext.Provider>
}
