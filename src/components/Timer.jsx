import React from 'react'

export default function Timer(props) {
    let seconds = ((props.timer.value % 60000) / 1000 ).toFixed(0);
    let minutes = Math.floor(props.timer.value / 60000)

    return(
        <>
            {props.timer.isRunning &&
                <>
                    <h3 className="timer">
                        {`Time ${minutes >= 10 ? minutes : '0' + minutes}:${seconds >= 10 ? seconds : '0' + seconds}`} 
                    </h3>
                    <h3 className="current-score">
                        {`Rolls: ${props.rolls}`}
                    </h3>
                </>
            }
        </>
    )
}