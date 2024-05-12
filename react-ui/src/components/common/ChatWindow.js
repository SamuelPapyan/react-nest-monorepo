import React, { useEffect, useState } from "react";
import { socket } from "../../socket";
import ChatContent from "./ChatContent";
import GroupChatService from "../../services/groupChatService";

export default function ChatWindow(props) {
    const [data, setData] = useState([]);
    const [updated, setUpdated] = useState(false);
    const [selectBar, setSelectBar] = useState("");
    const [chatId, setChatId] = useState("");
    // const [chatName, setChatName] = useState("DM with Coach");
    let _chatInput, _window, _select = React.useRef();
    let chatName;
    useEffect(()=>{
        socket.connect();
    })

    function refreshChat(chatId, user) {
        socket.emit('refresh chat', {
            chatId: chatId,
            user: user,
        });
    }

    useEffect(()=>{
        if (!updated) {
            if (props.type === "dm") {
                setChatId(props.data.coach + ':' + props.userId);
                refreshChat(props.data.coach + ':' + props.userId, props.data.coach);
                socket.on('refresh:' + props.data.coach + ':' + props.userId, (res)=>{
                    console.log("Response from socket: " + res.user);
                    const arr = res.data.map((value, index)=>{
                        return <ChatContent key={index} data={value} user={props.data.user}  styles={props.styles} isStaff={props.isStaff}/>
                    })
                    setData(arr);
                })
                setUpdated(true);
            }
            else if (props.type == "group_chat") {
                setChatId(props.chatId)
                refreshChat(props.chatId, props.data.coach);
                socket.on('refresh:' + props.chatId, function(res){
                    const arr = res.data.map((value, index)=>{
                        return <ChatContent key={index} data={value} user={props.data.user}  styles={props.styles} isStaff={props.isStaff}/>
                    })
                    setData(arr);
                })
                setUpdated(true);
            }
            else if (props.type == "common") {
                setChatId(props.data.coach + ':' + props.userId)
                refreshChat(props.data.coach + ':' + props.userId, props.userId);
                socket.on('refresh:' + props.data.coach + ':' + props.userId, (res)=>{
                    if (res.user === props.userId || res.user === undefined) {
                        const arr = res.data.map((value, index)=>{
                            return <ChatContent key={index} data={value} user={props.data.user}  styles={props.styles} isStaff={props.isStaff}/>
                        })
                        setData(arr);
                    }
                })
                GroupChatService.getGroupChatsByStudent(props.userId).then(res=>{
                    if (res.success) {
                        const options = res.data.map((v, i)=>{
                            return (<option key={i + 1} value={v._id}>{v.chat_name}</option>)
                        });
                        options.unshift(<option key={0} value={props.data.coach + ':' + props.userId}>DM with Coach</option>)
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
                        res.data.map((v, i)=>{
                            socket.on('refresh:' + v._id, function(res){
                                console.log(chatName, res.data[res.data.length - 1].chatName);
                                if (res.user === props.userId || res.user === undefined) {
                                    const arr = res.data.map((value, index)=>{
                                        return <ChatContent key={index} data={value} user={props.data.user} styles={props.styles} isStaff={props.isStaff}/>
                                    })
                                    setData(arr);
                                }
                            })
                        })
                        setUpdated(true);
                    }
                }).catch(err=>{
                    console.log(err.message);
                })
            }
        }
    }, [data])

    useEffect(()=>{
        _window.scrollTop = _window.scrollHeight;
    })

    useEffect(()=>{
        return ()=>{
            socket.off('refresh:' + props.data.coach + ':' + props.userId);
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
        console.log(chatName)
        if (_chatInput.value) {
            socket.emit('send chat message', {
                chatId: chatId,
                data: {
                    from: props.data.user,
                    content: _chatInput.value,
                    timestamp: Date.now(),
                    coach: props.data.coach,
                    student: props.userId,
                    chatName: chatName
                },
            })
            _chatInput.value = "";
        }
    }

    const defaultTextStyle = {
        textAlign: 'center',
        marginTop: '50%'
    }

    function switchChat(event){
        setChatId(event.target.value);
        const elem = [...event.target.children].find(val=>val.value === event.target.value);
        chatName = elem.innerText;
        refreshChat(event.target.value, props.userId);
    }

    return (
        <div
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
                <h5>{props.isStaff ? props.chatUsername : "Chat with your coach."}</h5>
                : 
                selectBar}
                <p onClick={()=>props.setVisible(false)}
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
                    <p style={{...defaultTextStyle}}>Chat with student {props.chatUsername}.</p> :
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