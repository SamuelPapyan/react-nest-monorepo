import { useEffect, useState } from "react";
import { socket } from "../../socket";
import ChatContent from "./ChatContent";

export default function ChatWindow(props) {
    const [data, setData] = useState([]);
    const [updated, setUpdated] = useState(false);
    let _chatInput, _window;
    useEffect(()=>{
        socket.connect();
        return () => {
            socket.disconnect();
        };
    })

    useEffect(()=>{
        if (!updated) {
            socket.emit('refresh chat', props.data.coach);
            socket.on('refresh', (res)=>{
                const arr = res.map((value, index)=>{
                    return <ChatContent key={index} data={value} styles={props.styles} isStaff={props.isStaff}/>
                })
                setData(arr);
            })
            setUpdated(true);
        }
    }, [data])

    useEffect(()=>{
        _window = document.querySelector('#chatWindow');
        _window.scrollTop = _window.scrollHeight;
    })

    useEffect(()=>{
        return ()=>{
            socket.off('refresh');
        }
    },[])
    const styles = {
        modalWindow: {
            position: "fixed",
            bottom: "70px",
            right: "20px",
            width: "370px",
            height: "65vh",
            maxWidth: "calc(100% - 48px)",
            maxHeight: "calc(100% - 48px)",
            backgroundColor: "white",
            borderRadius: "12px",
            border: "2px solid " + props.styles.primaryColor,
            overflow: "hidden",
            boxShadow: "0px 0px 16px 6px rgba(0, 0, 0, 0.33)",
            paddingTop: "20px"
        },
    }

    function sendChatMessage() {
        if (_chatInput.value) {
            socket.emit('send chat message', {
                from: props.data.user,
                to: props.isStaff ? 'student' : 'staff',
                content: _chatInput.value,
                timestamp: Date.now(),
                coach: props.data.coach,
            })
            _chatInput.value = "";
        }
    }

    const defaultTextStyle = {
        textAlign: 'center',
        marginTop: '50%'
    }

    return (
        <div
            hidden={!props.visible}
            style={{
                ...styles.modalWindow,
            }}
        >
            <div style={{
                height:'80%',
                width:'90%',
                margin:'auto',
                overflow: 'auto',
                scrollBehavior: 'smooth',
                backgroundColor: "#ececec",
                padding: '10px'
            }}
            id="chatWindow">
                {data}
                {data.length == 0 ? (
                    props.isStaff ?
                    <p style={{...defaultTextStyle}}>Chat with your students.</p> :
                    <p style={{...defaultTextStyle}}>Chat with your coach.</p>
                ) 
                : 
                ""}
            </div>
            <div className="d-flex justify-content-between align-items-center" style={{
                width:'90%',
                margin:'auto',
                paddingTop:'20px'
            }}>
                <textarea style={{
                    height:'100%',
                    width:'75%',
                }} type="text"
                className="d-block"
                ref={a=>_chatInput = a}></textarea>
                <button className="btn" style={{
                    backgroundColor: props.styles.primaryColor,
                    color: 'white',
                    height:'100%',
                    width:'20%',
                }}
                onClick={sendChatMessage}>Send</button>
            </div>
        </div>
    );
}