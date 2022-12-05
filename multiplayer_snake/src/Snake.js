import React, {useState} from "react";
import io from 'socket.io-client'

const socket = io.connect("http://localhost:3001");

export const Snake = () => {
    const [gameState, setGameState] = useState({})
    socket.on('gameState', (state) => {
        setGameState(state) 
    });    
    return (
        <div>
            {gameState.snakeDots.map((dot, i) => {
                const style = {
                    left: `${dot[0]}%`,
                    top: `${dot[1]}%`
                }
                return (
                    <div className="snake-dot" key={i} style={style}></div>
                )
            })}
        </div>
)
}