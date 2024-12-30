import { Header } from './components/Header'
import styles from './app.module.css'

function App() {

  function handleRestartGame() {
    alert('Restarting game')
  }

  return (
    <div className={styles.container}>
      <main>
        <Header current={5} max={10} onRestart={handleRestartGame} />
      </main>
    </div>
  )
}

export default App
