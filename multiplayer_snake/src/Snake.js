import React from "react";

export default (props) => {
    return (
      <div>
        {props.snakeDots.map((dot, i) => {
          const style = {
            left: `${dot[0]}%`,
            top: `${dot[1]}%`
          }
          return (
            <div
              className={i === props.snakeDots.length - 1 ? `snake-head` : `snake-dot p${props.playerIndex}dot`}
              key={i}
              style={style}
            ></div>
          );
        })}
      </div>
    );
  };

