import SideBar from "../common/SideBar";
import AuthPanel from "./auth/AuthPanel";
import { Outlet } from "react-router";
import '../../style/App.css';
import AuthService from "../../services/authService";
import { useEffect, useState } from "react";

export default function AdminBody(props) {
    const [updated, setUpdated] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(()=>{
        if (!updated) {
            AuthService.getProfile().then(res=>{
                if (res.success) {
                    setUserData(res.data);
                    setUpdated(true);
                }
            })
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
                    <SideBar/>
                    <div className="router-screen">
                        <AuthPanel changeLang={props.changeLang}/>
                        <Outlet context={userData}/>
                    </div>
                </div>
            </div>
        </>
    )
}