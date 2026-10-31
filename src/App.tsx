import React from 'react'

const phrases = [
  '더 나은 경험을 위해',
  '잠시 멈춥니다.',
  '곧 다시 만나겠습니다.',
]

const App: React.FC = () => {
  return (
    <main className="maintenance" aria-labelledby="maintenance-title">
      <span className="wordmark">LSHworkspace</span>

      <h1 id="maintenance-title" className="sr-only">
        더 나은 경험을 위해 잠시 멈춥니다. 곧 다시 만나겠습니다.
      </h1>

      <div className="sequence" aria-hidden="true">
        {phrases.map((phrase, index) => (
          <p className={`phrase phrase-${index + 1}`} key={phrase}>{phrase}</p>
        ))}
      </div>

      <span className="status">서비스 점검 중</span>
    </main>
  )
}

export default App
