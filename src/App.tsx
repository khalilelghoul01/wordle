import { Component, createEffect, createSignal, For, Show } from 'solid-js'
import words from './wordlist'
let found = false
// random 100 words with 5 letters

const App: Component = () => {
  const [solution, setSolution] = createSignal(
    words[Math.floor(Math.random() * words.length)],
  )
  const [gameOver, setGameOver] = createSignal(false)
  const [guesses, setGuesses] = createSignal(Array(6).fill(''))
  let row = 0
  console.log(solution())
  // let final = false
  createEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (gameOver()) return
      let currentGuess = guesses()[row]
      let key = /[a-zA-Z]{1}/.test(e.key) ? e.key : ''
      if (e.key.length === 1 && currentGuess.length < 5) {
        currentGuess += key.toLowerCase()
      }
      if (e.key === 'Backspace') {
        currentGuess = currentGuess.slice(0, -1)
      }
      setGuesses([
        ...guesses().slice(0, row),
        currentGuess,
        ...guesses().slice(1 + row),
      ])
      if (currentGuess.length == 5 && row < 5) {
        row++
      }
      if (guesses()[5].length == 5 || found) {
        setTimeout(() => {
          setGameOver(true)
          row++
        }, 200)
      }
    }

    document.addEventListener('keydown', handleKeys)
    return () => {
      document.removeEventListener('keydown', handleKeys)
    }
  }, [])

  return (
    <div>
      {!gameOver() && (
        <div class="container">
          <h1>Wordle</h1>
          <div class="wrapper">
            {guesses().map((guess, index) => {
              let final = false
              if (index >= row) {
                final = false
              } else {
                final = true
              }

              return <Line guess={guess} solution={solution()} final={final} />
            })}
            <small>use keyboard for input</small>
          </div>
        </div>
      )}
      {gameOver() && (
        <div class="container">
          <h1>Game Over</h1>
          <h4>The word was "{solution()}"</h4>
          {found && <h5>you nail it after {row == 5 ? 6 : row} times</h5>}
          {!found && <h5>you didn't find the word</h5>}
          <div class="wrapper">
            <button onclick={() => location.reload()}>restart</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

const Line = ({
  guess,
  solution,
  final,
}: {
  guess: string
  solution: string
  final: boolean
}) => {
  let chars = guess.split('')
  if (chars.length < 5) {
    chars = chars.concat(Array(5 - chars.length).fill(''))
  } else if (chars.length > 5) {
    chars = chars.slice(0, 5)
  }
  return (
    <div>
      <ul>
        {chars.map((letter, index) => {
          if (guess === solution) {
            found = true
          }
          if (letter === solution[index] && guess.length == 5) {
            return <li class="correct">{letter}</li>
          } else if (
            solution.includes(letter) &&
            letter !== '' &&
            guess.length == 5
          ) {
            return <li class="unordered">{letter}</li>
          }

          return <li class="normal">{letter}</li>
        })}
      </ul>
    </div>
  )
}
