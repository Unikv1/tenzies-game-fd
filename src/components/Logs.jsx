import React from 'react'

export default function Logs(props) {
    let BestSeconds = ((props.bestTime % 60000) / 1000 ).toFixed(0);
    let BestMinutes = Math.floor(props.bestTime / 60000)

    
    const logElements = props.logs.map(log => (
        <div className='logs--result'>
                <h4 className='logs--result--box'>{log.rolls}</h4>
                <h4 className='logs--result--box'> {`${Math.floor(log.time / 60000) >= 10 ? Math.floor(log.time / 60000) : '0' + Math.floor(log.time / 60000)}:${((log.time % 60000) / 1000 ).toFixed(0) >= 10 ? ((log.time % 60000) / 1000 ).toFixed(0) : '0' + ((log.time % 60000) / 1000 ).toFixed(0)}`}</h4>
        </div>
    ))

    const sortedLogs = props.logs ? props.logs.sort( (a, b) => a.rolls - b.rolls) : []

    return(
        <section className='logs'>
            <h3 className='logs--highscore'> {`Lowest rolls # ${sortedLogs[0]?.rolls ? JSON.stringify(sortedLogs[0].rolls) : '0'}`}</h3>
            <h3 className='logs--time'> {`Best Time ${BestMinutes >= 10 ? BestMinutes : '0' + BestMinutes}:${BestSeconds >= 10 ? BestSeconds : '0' + BestSeconds}`} </h3>
            <h3 className='logs--title'> Game History </h3>
            <div className='logs--list'>
                <h4 className='logs--header'> rolls </h4>
                <h4 className='logs--header'> time </h4>
                {props.logs && logElements}
            </div>
        </section>
    )
}