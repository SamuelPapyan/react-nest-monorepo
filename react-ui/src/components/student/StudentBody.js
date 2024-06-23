import StudentSidebar from "./StudentSidebar"
import StudentAuthPanel from './StudentAuthPanel'
import { Outlet } from "react-router"
import ChatBox from "../common/ChatBox";

import '../../style/App.css';
import { useEffect } from "react";

export default function StudentBody(props) {

    useEffect(()=>{
        if (window.localStorage.getItem(process.env.REACT_APP_STUDENT_TOKEN)) {
            window.__be = window.__be || {};
            window.__be.id = "6675beb7092d0b00071836e4";
            (function() {
                var be = document.createElement('script'); be.type = 'text/javascript'; be.async = true;
                be.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.chatbot.com/widget/plugin.js';
                var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(be, s);
            })();
        }
    })

    return (
        <>
            <div className="text-center">
                <div className="splitted-screen"
                style={{
                    position: "sticky",
                    top: "0"
                }}>
                    <StudentSidebar/>
                    <div className="router-screen">
                        <StudentAuthPanel setData={props.setData} data={props.data}/>
                        <Outlet context={props.data}/>
                    </div>
                </div>
            </div>
            {props.data ? 
            <ChatBox
            styles={{
                primaryColor: "#198754"
            }}
            type="dm"
            isStaff={false}
            user={props.data.username}
            userId={props.data.id}
            coach={props.data.coach}/>
            : ""}
        </>
    )
}