import React from 'react'

export default function Die(props) {
    const styles = {
        backgroundColor: props.die.isHeld ? "#59E391" : "#FFF"
    }
    return(
        <div className="tile" style={styles} onClick={props.toggleDice}>
            {props.die.value}
        </div>
    )
}