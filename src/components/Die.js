import React from 'react'

export default function Die(props){
  const styles = {
    background: props.isHeld ? "#59E391" : "white"
  }
  return (
    <div className="die" style={styles} onClick={props.holdDice}>
      <img className="die-img" src={`../images/dice-${props.value}.png`}></img>
    </div>
  )
}