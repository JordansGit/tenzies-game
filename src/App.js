import React from 'react'
import Die from './components/Die'
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'

function App() {
  const [dice, setDice] = React.useState(allNewDice())

  const [completed, setCompleted] = React.useState(false)

  const [count, setCount] = React.useState(0)

  const [seconds, setSeconds] = React.useState(0)

  const [lowestRolls, setLowestRolls] = React.useState(JSON.parse(localStorage.getItem('lowestRollsCount')) || '')

  /* this runs the interval on page load 

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, []) */

  // if local storage is empty, set current number of rolls to best rolls. 
  

  const timer = () => {
    setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1)
    }, 1000)
  }

  React.useEffect(() => {
    let winningNumber = dice[0].value
    const winningState = dice.every(die => die.isHeld && die.value === winningNumber);

    if (winningState) {
      setCompleted(true)
      if (lowestRolls === '' || lowestRolls > count) {
        setLowestRolls(count)
        localStorage.setItem('lowestRollsCount', JSON.stringify(lowestRolls))
      }
    }
  }, [dice])

  // referred to as a 'helper function', since we use the code inside the return statement multiple times, it's 
  // better to create a function that returns these values, then call the function when you want to use it. 
  // DRY = don't repeat yourself.  
  function generateNewDie() {
    return {
      value: Math.floor(Math.random() * 6) + 1,
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  function holdDice(id) {
    setDice(prevDice => prevDice.map(die => {
      return die.id === id 
        ? {...die, isHeld: !die.isHeld}
        : die
    }))
    if (seconds === 0) {
      timer() // only run the timer function if seconds = 0, aka if it hasn't started yet
    }
  }

  const dieElements = dice.map(die => (
    <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />
  ))

  function roll() {
    setDice(prevDice => prevDice.map(die => {
      return die.isHeld 
        ? die
        : generateNewDie()
    }))
    setCount(prevCount => prevCount + 1)
    if (seconds === 0) {
      timer() // only run the timer function if seconds = 0, aka if it hasn't started yet
    }
  }

  function newGame() {
    setDice(allNewDice())
    setCompleted(false)
    setCount(0)
    setSeconds(0)
  }

  return (
    <main>
      {completed && <Confetti />}
      <h1>Tenzies</h1>
      <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <h3>Your Lowest rolls completed: {lowestRolls}</h3>
      <h2>Time Taken: {seconds}</h2>
      <h2>{completed === true ? `You Won in ${count} Rolls` : 
        count === 0 ? 'Rolls Taken: ' : `Rolls Taken: ${count}`}
      </h2>

      <div className="dice-container">
        {dieElements}
      </div>
      <button onClick={completed ? newGame : roll}>{completed ? 'New Game' : 'Roll'}</button>
    </main>
  );
}

export default App;

/* 
To Do: 
  stop the timer when game is completed. 
  save that timer to local storage. 
    if new timer is faster than 1 in local storage, save the new 1 to local storage. 
    get local storage timer and display it in best time text. 

*/




/*
Learning Notes: 
  we set the state of dices to the function so that as soon as we load the page, the function runs and it sets new dice for us. 

  for getting the object of each individual die and passing it to the parent App: 
  - in die you just use onClick={props.holdDice} // holdDice is a function we'll create in App
  - in App you need to create the function holdDice with the parameter id (for now we console log it). 
    - the magic is in the props we set. 
  why do we need to use die.id inside holdDice={() => holdDice(die.id)}?? 
  - normally you use a callback function on the onClick in Die, but this is a shorter and easier way because you can pass in id here. 
    instead of creating a props for the die.id and passing it into the onclick callback function in Die. 
  - passing die.id gets the value of die.id in the Die component every time you click on a die, and now that value is passed into our 
    function for us to use in App. 

  why do we need to use a callback function for holdDice={() => holdDice(die.id)}? 
  - instead of returning the function, we are returning an anonymous function which returns the function holdDice with die.id as the parameter. 
  But why do we need to do this instead of just calling the function normally? 
  - i think maybe because the code won't run, maybe since we are putting the value = to our function, it doesn't run the function, but this way
    we put it = to an anonymous function that returns our function. 

  Why use useEffect here even though we are not dealing with a side effect? 
  - to keep 2 internal pieces of state in sync with each other ([dice, setDice] and [tenzies, setTenzies])
*/