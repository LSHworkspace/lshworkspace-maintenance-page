import React from 'react'
import { ShaderBackdrop } from './components/ShaderBackdrop'

const App: React.FC = () => {
  return (
    <main className="maintenance" aria-labelledby="maintenance-title">
      <ShaderBackdrop />

      <span className="wordmark">LSHworkspace</span>

      <section className="message">
        <p className="eyebrow">System maintenance</p>
        <h1 id="maintenance-title">잠시 점검 중입니다.</h1>
        <p className="description">
          더 안정적인 서비스를 위해 시스템을 정비하고 있습니다.<br />
          잠시 후 다시 이용해 주세요.
        </p>
      </section>

      <span className="status"><i aria-hidden="true" />서비스 점검 중</span>
    </main>
  )
}

export default App
