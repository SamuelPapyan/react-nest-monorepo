import React, { useEffect, useState } from "react";
import ChatContent from "./ChatContent";
import GroupChatService from "../../services/groupChatService";
import { io } from "socket.io-client";
import { useTranslation } from "react-i18next";

let chatId = "";

export default function ChatWindow(props) {
    const {t} = useTranslation();
    const [data, setData] = useState([]);
    const [updated, setUpdated] = useState(false);
    const [selectBar, setSelectBar] = useState("");
    const [socket, setSocket] = useState(io('http://localhost:2023/chat'))
    const [windowMessage, setWindowMessage] = useState(t("textChatWithCoachMessage"))
    let _chatInput, _window, _select = React.useRef();

    function refreshChat(oldChat, newChat, user) {
        socket.emit('join_room', {
            prevRoom: oldChat,
            nextRoom: newChat,
            user: {
                userId: "",
                userName: user,
                socketId: socket.id
            },
        });
    }

    function generateChat() {
        if (socket.connected) {
            if (props.type === "dm") {
                refreshChat(null, props.data.coach + ':' + props.userId, props.data.coach);
            }
            else if (props.type === "group_chat") {
                refreshChat(null, props.chatId, props.data.coach);
            }
            else if (props.type === "common") {
                refreshChat(null, props.data.coach + ':' + props.userId, props.userId);
            }
        }
    }

    useEffect(()=>{
        if (!updated) {
            socket.on('connect', (res)=>{
                generateChat();
            })
            socket.on('chat', (res)=>{
                const arr = res.data.map((value, index)=>{
                    return <ChatContent key={index} data={value} user={props.data.user}  styles={props.styles} isStaff={props.isStaff}/>
                })
                setData(arr);
            })
            if (props.type === "dm") {
                chatId = props.data.coach + ':' + props.userId;
                setUpdated(true);
            }
            else if (props.type === "group_chat") {
                chatId = props.chatId;
                setUpdated(true);
            }
            else if (props.type === "common") {
                chatId = props.data.coach + ':' + props.userId;
                GroupChatService.getGroupChatsByStudent(props.userId).then(res=>{
                    if (res.success) {
                        const options = res.data.map((v, i)=>{
                            return (<option key={i + 2} value={v._id}>{v.chat_name}</option>)
                        });
                        options.unshift(<option key={1} value={"chatbot" + ':' + props.userId}>{t("textChatWithAi")}</option>)
                        options.unshift(<option key={0} value={props.data.coach + ':' + props.userId}>{t("textChatWithCoach")}</option>)
                        setSelectBar(
                            <select
                            id="chat-select"
                            style={{
                                width:"95%",
                                borderRadius: "25px",
                                marginBottom: "5px",
                            }} onChange={switchChat} ref={_select}>
                                {options}
                            </select>
                        )
                        setUpdated(true);
                    }
                }).catch(err=>{
                    console.log(err.message);
                })
            }
        } else {
            setUpdated(updated);
        }
    }, [data])

    useEffect(()=>{
        _window.scrollTop = _window.scrollHeight;
    })

    const styles = {
        modalWindow: {
            borderColor: props.styles.primaryColor,
        },
    }

    function sendChatMessage() {
        if (_chatInput.value) {
            let chatName = chatId;
            if (props.isStaff) {
                if (props.type === "dm") {
                    chatName = props.data.coach + ':' + props.userId
                }
                if (props.type === "group_chat") {
                    chatName = props.chatId;
                }
            }
            socket.emit('chat', {
                user: {
                    userId: "",
                    userName: props.data.user,
                    socketId: socket.id
                },
                timeSent: Date.now(),
                message: _chatInput.value,
                roomName: chatName,
                lang: window.localStorage.getItem('react-nest-monorepo-lang') ?? "en"
            })
            _chatInput.value = "";
        }
    }

    const defaultTextStyle = {
        textAlign: 'center',
        marginTop: '50%'
    }

    function switchChat(event){
        refreshChat(chatId, event.target.value, props.userId);
        if (event.target.value.indexOf("chatbot") > -1) {
            setWindowMessage(t("textChatWithAiMessage"))
        } else if (event.target.value.indexOf(props.data.coach) > -1) {
            setWindowMessage(t("textChatWithCoachMessage"))
        } else {
            setWindowMessage(t("textGroupChat"));
        }
        chatId = event.target.value;
    }

    return (
        <div className="chat-window"
            style={{
                ...styles.modalWindow,
                visibility: props.visible ? 'visible' : 'collapse',
                zIndex: props.zIndex,
            }}
        >
            <div className="d-flex justify-content-between" style={{
                padding: "0 10px",
            }}>
                {props.type !== "common" ? 
                <h5>{props.isStaff ? props.chatUsername : windowMessage}</h5>
                : 
                selectBar}
                <p onClick={()=>{
                    props.setVisible(false)
                }}
                style={{
                    cursor: "pointer",
                    fontWeight: 'bolder',
                }}>x</p>
            </div>
            <div style={{
                height:'70%',
                width:'90%',
                margin:'auto',
                overflow: 'auto',
                scrollBehavior: 'smooth',
                backgroundColor: "#ececec",
                padding: '10px'
            }}
            ref={a=>_window = a}>
                {data}
                {data.length == 0 ? (
                    props.isStaff ?
                    <p style={{...defaultTextStyle}}>{t("textChatWithStudentMessage", {student: props.chatUsername})}</p> :
                    <p style={{...defaultTextStyle}}>{windowMessage}</p>
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
                    width:t("dimenChatInputWidth"),
                }} type="text"
                className="d-block"
                ref={a=>_chatInput = a}></textarea>
                <button className="btn" style={{
                    backgroundColor: props.styles.primaryColor,
                    color: 'white',
                    height:'100%',
                    width: t("dimenChatSendWidth"),
                }}
                onClick={sendChatMessage}>{t("textSend")}</button>
            </div>
        </div>
    );
}