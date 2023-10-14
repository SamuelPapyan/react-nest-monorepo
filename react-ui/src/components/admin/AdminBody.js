import SideBar from "../../SideBar";
import AuthPanel from "./auth/AuthPanel";
import { Outlet } from "react-router";

import '../../style/App.css';

export default function AdminBody() {

    return (
        <div className="text-center">
            <div className="splitted-screen"
            style={{
                position: "sticky",
                top: "0"
            }}>
                <SideBar/>
                <div className="router-screen">
                    <AuthPanel/>
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}