import React, { useEffect } from 'react'
import { ShaderBackdrop } from './components/ShaderBackdrop'

const App: React.FC = () => {
  useEffect(() => {
    if (import.meta.env.DEV) return

    let checking = false
    const checkRecovery = async () => {
      if (checking || document.visibilityState !== 'visible') return
      checking = true
      try {
        const response = await fetch(window.location.href, {
          method: 'HEAD',
          cache: 'no-store',
        })
        const isFallback = response.headers.has('X-LSHworkspace-Fallback')
        if (response.ok && !isFallback) window.location.reload()
      } catch {
        // The maintenance page remains stable while the origin is unavailable.
      } finally {
        checking = false
      }
    }

    const retry = window.setInterval(checkRecovery, 30_000)
    return () => window.clearInterval(retry)
  }, [])

  return (
    <main className="maintenance" aria-labelledby="maintenance-title">
      <ShaderBackdrop />

      <section className="message">
        <p className="service-name">LSHworkspace · System maintenance</p>
        <h1 id="maintenance-title">더 나은 경험을 위해<br />잠시 멈춥니다.</h1>
        <p className="description">
          시스템을 정비하고 있습니다.<br />
          서비스가 복구되면 자동으로 다시 연결됩니다.
        </p>
      </section>

      <footer className="legal">
        <small>© 2022–2026 LSHworkspace. All rights reserved.</small>
        <a href="mailto:contact@lshworkspace.com">contact@lshworkspace.com</a>
      </footer>
    </main>
  )
}

export default App
