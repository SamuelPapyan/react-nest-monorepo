import { useState } from "react";
import ChatWindow from "./ChatWindow";

export default function ChatBox(props) {
    const [visible, setVisible] = useState(false);
    const styles = {
        chatWidget: {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: props.styles.primaryColor,
            padding: "10px",
            borderRadius: "25px",
            cursor: "pointer",
        },
     
     }
     return (
        <div>
        <ChatWindow
          setVisible={setVisible}
          type="common"
          isStaff={props.isStaff}
          styles={{...props.styles}}
          data={{
            user: props.user,
            coach: props.coach
          }}
          visible={visible}
          chatUsername={props.username}
          userId={props.userId}
          chatTitle={props.username}/>
          <div
            style={{
              ...styles.chatWidget
            }}
          >
            <div className="d-flex justify-content-center align-items-center">
              <img alt="chat_icon" onClick={()=>setVisible(!visible)} src="/images/chat_icon.svg" style={{
                width:"24px"
              }}/>
            </div>
          </div>
        </div>
      );
}