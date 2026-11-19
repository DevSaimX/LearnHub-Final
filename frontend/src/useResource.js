import { useEffect, useState } from 'react'
import { api, errorMessage } from './api'

export function useResource(path) {
  const [result, setResult] = useState({ path: null, data: null, error: '' })
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    if (!path) return
    const controller = new AbortController()
    api.get(path, { signal: controller.signal }).then(({ data }) => {
      if (!controller.signal.aborted) setResult({ path, data, error: '' })
    }).catch(error => {
      if (!controller.signal.aborted) setResult({ path, data: null, error: errorMessage(error) })
    })
    return () => controller.abort()
  }, [path, revision])

  function reload() {
    setResult(previous => ({ ...previous, error: '' }))
    setRevision(value => value + 1)
  }

  return { ...(result.path === path ? result : { data: null, error: '' }), reload }
}
