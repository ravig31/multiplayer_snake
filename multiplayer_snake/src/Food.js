import React from "react";
const goldenapple = require('./assets/apple.png')

export default (props) => {

    const style = {
        left: `${props.dot[0]}%`,
        top: `${props.dot[1]}%`,
        position: 'relative',
        width: '2%',
        height: '2%',
    }
    return (
        <div style={style} className="food">
            <img src={goldenapple} style={{
                position: 'absolute',
                left: '-50%',
                top: '-50%',
                width: '200%',
                height: '200%',
            }}/>
        </div>
    )
}
