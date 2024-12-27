import { useState } from "react";
import ChatWindow from "./ChatWindow";

export default function ChatBox(props) {
    const [visible, setVisible] = useState(false);
    const styles = {
        chatWidget: {
            backgroundColor: props.styles.primaryColor,
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
          <div id="chat-widget"
            style={{
              ...styles.chatWidget
            }}
          >
            <div id="student-chat-button" className="d-flex justify-content-center align-items-center">
              <img alt="chat_icon" onClick={()=>setVisible(!visible)} src="/images/chat_icon.svg"/>
            </div>
          </div>
        </div>
      );
}