type AnswerButtonProps = {
  answer: string
  correctAnswer: string
  selectedAnswer: string | null
  onSelect: (answer: string) => void
}

function AnswerButton({
  answer,
  correctAnswer,
  selectedAnswer,
  onSelect,
}: AnswerButtonProps) {
  const hasSelection = selectedAnswer !== null
  const isSelected = selectedAnswer === answer
  const isCorrect = answer === correctAnswer

  let className = 'answer-button'

  if (hasSelection) {
    if (isCorrect) {
      className += ' correct'
    } else if (isSelected) {
      className += ' incorrect'
    }
  }

  return (
    <button
      className={className}
      onClick={() => onSelect(answer)}
      disabled={hasSelection}
      type="button"
    >
      {answer}
    </button>
  )
}

export default AnswerButton
