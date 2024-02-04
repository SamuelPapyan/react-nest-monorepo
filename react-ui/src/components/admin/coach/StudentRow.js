import React from "react";

export default function StudentRow(props) {
    return (
        <div className="d-flex justify-content-between mx-5 my-2 p-2 align-items-center rounded bg-primary" style={{
            border: "1px solid azure"
        }}>
            <p className="d-block text-light"><b>{props.data.username}</b></p>
            {props.data.handUp ? 
            <img className="d-block" alt="Hand Up" src={"/images/hand_up_yellow.svg"} style={{
                width:40,
                height:40
            }}/>
            : ""}
        </div>
    )
}