const QUESTIONS_URL = 'https://the-trivia-api.com/v2/questions?limit=10'

type TriviaApiQuestion = {
  id: string
  category: string
  correctAnswer: string
  incorrectAnswers: string[]
  question: {
    text: string
  }
  difficulty: string
}

export type QuizQuestion = {
  id: string
  category: string
  difficulty: string
  question: string
  correctAnswer: string
  answers: string[]
}

const shuffleAnswers = (answers: string[]) => {
  const shuffled = [...answers]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ]
  }

  return shuffled
}

export const fetchQuestions = async (): Promise<QuizQuestion[]> => {
  const response = await fetch(QUESTIONS_URL)

  if (!response.ok) {
    throw new Error('Failed to fetch trivia questions')
  }

  const data = (await response.json()) as TriviaApiQuestion[]

  return data.map((question) => ({
    id: question.id,
    category: question.category,
    difficulty: question.difficulty,
    question: question.question.text,
    correctAnswer: question.correctAnswer,
    answers: shuffleAnswers([
      question.correctAnswer,
      ...question.incorrectAnswers,
    ]),
  }))
}
