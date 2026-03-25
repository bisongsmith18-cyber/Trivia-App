type ScoreScreenProps = {
  score: number
  totalQuestions: number
  onRestart: () => void
}

function ScoreScreen({
  score,
  totalQuestions,
  onRestart,
}: ScoreScreenProps) {
  return (
    <main className="app-shell">
      <section className="quiz-card score-card">
        <p className="eyebrow">Quiz complete</p>
        <h1>
          You scored {score}/{totalQuestions}
        </h1>
        <p className="supporting-text">
          Play again to get a fresh set of random questions.
        </p>
        <button className="primary-button" onClick={onRestart} type="button">
          Play Again
        </button>
      </section>
    </main>
  )
}

export default ScoreScreen
