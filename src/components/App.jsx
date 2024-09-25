import { useState, useEffect } from 'react'
import '../css/App.css'
import Die from './Die.jsx'
import Timer from './Timer.jsx'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import Logs from './Logs.jsx'

function App() {
  const [difficulty, setDifficulty] = useState(
    JSON?.parse(localStorage.getItem("diff")) || 10
  )
  const [dice, setDice] = useState(rollDice(difficulty))
  const [tenzies, setTenzies] = useState(false);
  const [timer, setTimer] = useState(
    JSON?.parse(localStorage.getItem("timer")) || ({
      startTime: 0,
      value: 0,
      isRunning: false,
      bestTime: 0
    })
  )
  const [rolls, setRolls] = useState(0)
  const [logs, setLogs] = useState(
    JSON?.parse(localStorage.getItem("logs")) || []
  )

  function rollDice(size) {
    const dice_arr = []
    for (let i = 0; i < size; i++) {
      dice_arr.push({
        id: nanoid(),
        value: Math.floor(Math.random()*6),
        isHeld: false
      });
    }
    return dice_arr
  }

  function rerollDice() {
    setDice(oldDice => {
      return oldDice.map(oldDie => {
        return oldDie.isHeld ? {...oldDie} : {...oldDie, value: Math.floor(Math.random()*6)}
      })
    })
    setRolls(prevRolls => prevRolls + 1)
    
    const now = new Date().getTime()
    timer.isRunning ? null : setTimer(prevTimer => ({...prevTimer, isRunning: true, startTime: now}))
  }

  useEffect(() => {
    const firstDie = dice[0].value;
    let allTrue = true;
    for(let i = 0; i < dice.length; i++) {
      dice[i].value === firstDie && dice[i].isHeld ? allTrue : allTrue = false;
    }
    if( allTrue ) {
      setTenzies(true)
      var newBestTime = timer.value
      setLogs(prevLogs => ([...prevLogs, {rolls: rolls, time: timer.value}] ))
      setRolls(0)
      console.log(logs)
      if( timer.bestTime == 0){
        setTimer(prevTimer => ({...prevTimer, bestTime: newBestTime, isRunning: false}))
      } else if ( timer.bestTime > timer.value ) {
        setTimer(prevTimer => ({...prevTimer, bestTime: newBestTime, isRunning: false}))
      } else {
        setTimer(prevTimer => ({...prevTimer, isRunning: false}))
      }
    } else {
      setTenzies(false)
    }
    
  }, [dice])

// GAME START, START TIMER
  useEffect(() => {
    let intervalID;
    if( timer.isRunning ) {
      intervalID = setInterval(() => {
        setTimer(prevTimer => ({
          ...prevTimer,
          value: new Date().getTime() - prevTimer.startTime
        }));
      }, 100);
    }
    return () => {
      intervalID ? clearInterval(intervalID) : null
    }
  }, [timer.isRunning])

  useEffect(() => {
    localStorage.setItem("timer", JSON.stringify(timer))
  }, [timer.bestTime])

  useEffect(() => {
    localStorage.setItem("logs", JSON.stringify(logs))
  }, [logs])

  useEffect(() => {
    localStorage.setItem("diff", JSON.stringify(difficulty))
  }, [difficulty])

  function toggleDice(dieId) {
    const now = new Date().getTime()
    timer.isRunning ? null : setTimer(prevTimer => ({...prevTimer, isRunning: true, startTime: now}))
    setDice(prevDice => {
      return prevDice.map(oldDie => {
        return oldDie.id === dieId ? {...oldDie, isHeld: !oldDie.isHeld} : oldDie
      })
    })
  }

  function newGame() {
    setDice(rollDice(dice.length + 5))
    setTimer(prevTimer => ({...prevTimer, isRunning: false, value: 0}))
    setDifficulty(prevDifficulty => prevDifficulty + 5)
  }


  function wipeAllData() {
    localStorage.clear()
    window.location.reload(false)
  }

  const diceElements = dice.map(die => 
    <Die
      key={die.id}
      die={die}
      toggleDice={() => toggleDice(die.id)}
    />
  )

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className='main--title'> Tenzies </h1>
      <h2 className='main--description'> Roll until all dice are the same. Click each die to freeze it at its current value between rolls. Each time it will get more difficult. You can start over by clicking the Reset button </h2>
      <div className='main--tiles'>
        {diceElements}
      </div>
      {
        !tenzies &&
        <button className='main--button' onClick={rerollDice}>
        Roll
        </button>
      }
      {
        
        tenzies && 
        <>
          <h2 className="main--win"> You won! </h2>
          <button className='main--button' onClick={newGame}>
            NG+
          </button>
        </>
      }
      <Timer 
        timer={timer}
        rolls={rolls}
      />
      <Logs
        key={timer.value}
        bestTime={timer.bestTime}
        rolls={rolls}
        logs={logs}
        
      />
      <button className='main--button' onClick={wipeAllData}> Reset</button>
    </main>
  )
}

export default App
