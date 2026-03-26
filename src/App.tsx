import { useEffect, useState } from 'react'
import AnswerButton from './components/answerbutton'
import ScoreScreen from './components/scorescreen'
import StartScreen from './components/startscreen'
import { fetchQuestions, type QuizQuestion } from './api/question'
import './App.css'

const QUESTION_TIME_LIMIT = 15

function App() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT)

  useEffect(() => {
    if (!gameStarted) {
      return
    }

    let ignore = false

    const loadQuestions = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await fetchQuestions()

        if (!ignore) {
          setQuestions(data)
          setCurrentIndex(0)
          setScore(0)
          setShowScore(false)
          setSelectedAnswer(null)
          setTimeLeft(QUESTION_TIME_LIMIT)
        }
      } catch {
        if (!ignore) {
          setError('Could not load trivia questions. Please try again.')
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadQuestions()

    return () => {
      ignore = true
    }
  }, [gameStarted])

  const startGame = () => {
    setGameStarted(true)
  }

  const restartGame = () => {
    setGameStarted(false)
    setQuestions([])
    setCurrentIndex(0)
    setScore(0)
    setShowScore(false)
    setLoading(false)
    setError('')
    setSelectedAnswer(null)
    setTimeLeft(QUESTION_TIME_LIMIT)
  }

  const goToNextQuestion = () => {
    const nextIndex = currentIndex + 1

    if (nextIndex >= questions.length) {
      setShowScore(true)
    } else {
      setCurrentIndex(nextIndex)
      setTimeLeft(QUESTION_TIME_LIMIT)
    }

    setSelectedAnswer(null)
  }

  useEffect(() => {
    if (!gameStarted || loading || error || showScore || questions.length === 0) {
      return
    }

    if (selectedAnswer !== null) {
      return
    }

    if (timeLeft <= 0) {
      setSelectedAnswer('')

      const timeoutId = window.setTimeout(() => {
        goToNextQuestion()
      }, 900)

      return () => {
        window.clearTimeout(timeoutId)
      }
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((currentTime) => currentTime - 1)
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [currentIndex, error, gameStarted, loading, questions.length, selectedAnswer, showScore, timeLeft])

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) {
      return
    }

    const currentQuestion = questions[currentIndex]
    const isCorrect = answer === currentQuestion.correctAnswer

    setSelectedAnswer(answer)

    if (isCorrect) {
      setScore((currentScore) => currentScore + 1)
    }

    window.setTimeout(() => {
      goToNextQuestion()
    }, 900)
  }

  if (!gameStarted) {
    return <StartScreen onStart={startGame} />
  }

  if (loading) {
    return (
      <main className="app-shell">
        <section className="quiz-card status-card">
          <p className="eyebrow">Fetching questions</p>
          <h1>Loading your quiz...</h1>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="app-shell">
        <section className="quiz-card status-card">
          <p className="eyebrow">Something went wrong</p>
          <h1>{error}</h1>
          <button className="primary-button" onClick={restartGame} type="button">
            Back to Start
          </button>
        </section>
      </main>
    )
  }

  if (!questions.length) {
    return (
      <main className="app-shell">
        <section className="quiz-card status-card">
          <p className="eyebrow">No questions found</p>
          <h1>Try loading a new quiz.</h1>
          <button className="primary-button" onClick={restartGame} type="button">
            Back to Start
          </button>
        </section>
      </main>
    )
  }

  if (showScore) {
    return (
      <ScoreScreen
        score={score}
        totalQuestions={questions.length}
        onRestart={restartGame}
      />
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <main className="app-shell">
      <section className="quiz-card">
        <header className="quiz-header">
          <div>
            <p className="eyebrow">Trivia App</p>
            <h1>{currentQuestion.question}</h1>
          </div>
          <div className="quiz-meta">
            <span>
              Question {currentIndex + 1}/{questions.length}
            </span>
            <span>Score {score}</span>
            <span className={timeLeft <= 5 ? 'timer-pill warning' : 'timer-pill'}>
              Time {timeLeft}s
            </span>
          </div>
        </header>

        <div className="answers-grid">
          {currentQuestion.answers.map((answer) => (
            <AnswerButton
              key={answer}
              answer={answer}
              correctAnswer={currentQuestion.correctAnswer}
              selectedAnswer={selectedAnswer}
              onSelect={handleAnswerSelect}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
