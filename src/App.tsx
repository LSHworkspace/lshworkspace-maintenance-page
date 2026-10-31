import React from 'react'
import { ShaderBackdrop } from './components/ShaderBackdrop'

const App: React.FC = () => {
  return (
    <main className="maintenance" aria-labelledby="maintenance-title">
      <ShaderBackdrop />

      <section className="message">
        <p className="service-name">LSHworkspace</p>
        <h1 id="maintenance-title">서비스를 잠시<br />이용할 수 없습니다.</h1>
        <p className="description">
          더 안정적인 서비스를 위해 시스템을 정비하고 있습니다.<br />
          잠시 후 다시 이용해 주세요.
        </p>
        <div className="actions">
          <button type="button" onClick={() => window.location.reload()}>다시 시도</button>
          <a href="mailto:contact@lshworkspace.com">문의하기</a>
        </div>
      </section>
    </main>
  )
}

export default App
