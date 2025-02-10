import React from "react";
import ChatWindow from "../../common/ChatWindow";
import { useState } from "react";

export default function StudentRow(props) {
    const [visible, setVisible] = useState(false);
    return (
        <div className="d-flex justify-content-between mx-3 my-2 p-2 align-items-center rounded bg-primary" style={{
            border: "1px solid azure"
        }}>
            <p className="d-block text-light"><b>{props.data.username}</b></p>
            <div className="d-flex">
                {props.data.handUp ? 
                <img className="d-block" alt="Hand Up" src={"/images/hand_up_yellow.svg"} style={{
                    width:40,
                    height:40
                }}/>
                : ""}
                <div>
                    <img className="d-block chat-image"
                    alt="Chat Icon"
                    src={"/images/chat_icon.svg"} 
                    onClick={()=>setVisible(!visible)}
                    />
                    <ChatWindow
                      type="dm"
                      setVisible={setVisible}
                      isStaff={true}
                      styles={{
                        primaryColor: "#033E8A", 
                      }}
                      data={{
                        user: props.userData.username,
                        coach: props.userData.username,
                      }}
                      visible={visible}
                      zIndex={props.zIndex}
                      chatUsername={props.data.username}
                      userId={props.data.id}
                    />
                </div>
            </div>
        </div>
    )
}