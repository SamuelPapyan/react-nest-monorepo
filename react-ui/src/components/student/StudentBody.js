import StudentSidebar from "./StudentSidebar"
import StudentAuthPanel from './StudentAuthPanel'
import { Outlet } from "react-router"
import ChatBox from "../common/ChatBox";

import '../../style/App.css';

export default function StudentBody(props) {
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
            isStaff={false}
            user={props.data.username}
            coach={props.data.coach}/>
            : ""}
        </>
    )
}