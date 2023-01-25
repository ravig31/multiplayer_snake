import React from "react";
const pineapple = require('./assets/apple.png')

export default (props) => {

    const style = {
        left: `${props.dot[0]}%`,
        top: `${props.dot[1]}%`
    }
    return (
        <img src={pineapple} style={style} className="food" alt="food image" />
    )
}