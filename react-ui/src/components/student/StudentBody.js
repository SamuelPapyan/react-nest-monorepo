import StudentSidebar from "./StudentSidebar"
import StudentAuthPanel from './StudentAuthPanel'
import { Outlet } from "react-router"

import '../../style/App.css';

export default function StudentBody(props) {
    return (
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
    )
}