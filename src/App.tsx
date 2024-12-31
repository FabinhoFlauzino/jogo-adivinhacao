import { Header } from './components/Header'
import styles from './app.module.css'
import { Tip } from './components/Tip'
import { Letter } from './components/Letter'
import { Input } from './components/Input'
import { Button } from './components/Button'
import { LettersUsed, LetterUsedProps } from './components/LettersUsed'
import { Challenge, WORDS } from './utils/words'
import { useEffect, useState } from 'react'

const ATTEMPTS_MARGIN = 5

function App() {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [lettersUsed, setLettersUsed] = useState<LetterUsedProps[]>([])
  const [letter, setLetter] = useState("")
  const [score, setScore] = useState(0)

  function handleRestartGame() {
    const isConfirmed = window.confirm('Deseja reiniciar o jogo?')

    if (isConfirmed) {
      startGame()
    }
  }

  function startGame() {
    const index = Math.floor(Math.random() * WORDS.length)
    const randomWord = WORDS[index]
    setChallenge(randomWord)
    setScore(0)
    setLettersUsed([])
    setLetter("")
  }

  function handleConfirm() {
    if (!challenge) {
      return
    }

    if (!letter.trim()) {
      return alert('Digite uma letra')
    }

    const value = letter.toUpperCase()
    const exists = lettersUsed.find((used) => used.value.toUpperCase() === value)

    if (exists) {
      setLetter("")
      return alert('Letra já utilizada ' + value)
    }

    const hits = challenge.word.toUpperCase().split("").filter((l) => l === value).length

    const correct = hits > 0
    const currentScore = score + hits

    setLettersUsed((prevState) => [...prevState, { value, correct }])
    setScore(currentScore)

    setLetter("")
  }

  function endGame(message: string) {
    alert(message)
    startGame()
  }

  useEffect(() => {
    startGame()
  }, [])

  useEffect(() => {
    if (!challenge) {
      return
    }

    setTimeout(() => {
      if (score === challenge.word.length) {
        return endGame('Você venceu!')
      }

      if (lettersUsed.length === challenge.word.length + ATTEMPTS_MARGIN) {
        return endGame('Você perdeu!')
      }
    }, 200)
  }, [score, lettersUsed.length])

  if (!challenge) {
    return
  }

  return (
    <div className={styles.container}>
      <main>
        <Header
          current={lettersUsed.length}
          max={challenge.word.length + ATTEMPTS_MARGIN}
          onRestart={handleRestartGame}
        />
        <Tip tip={challenge.tip} />

        <div className={styles.word}>
          {challenge.word.split("").map((letter, index) => {
            const letterUsed = lettersUsed.find((used) => used.value.toUpperCase() === letter.toUpperCase())

            return <Letter value={letterUsed?.value} key={index} color={letterUsed?.correct ? "correct" : "default"} />
          })}
        </div>

        <h4>Palpite</h4>

        <div className={styles.guess}>
          <Input
            value={letter}
            autoFocus
            maxLength={1}
            placeholder="?"
            onChange={(e) => setLetter(e.target.value)}
          />
          <Button title="Confirmar" onClick={handleConfirm} />
        </div>

        <LettersUsed data={lettersUsed} />
      </main>
    </div>
  )
}

export default App
