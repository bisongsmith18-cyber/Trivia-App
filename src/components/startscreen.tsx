type StartScreenProps = {
  onStart: () => void
}

function StartScreen({ onStart }: StartScreenProps) {
  return (
    <main className="app-shell">
      <section className="quiz-card start-card">
        <p className="eyebrow">Welcome</p>
        <h1>Trivia App</h1>
        <p className="supporting-text">
          Test yourself with 10 multiple-choice questions pulled from a live
          trivia API.
        </p>
        <button className="primary-button" onClick={onStart} type="button">
          Start Quiz
        </button>
      </section>
    </main>
  )
}

export default StartScreen
