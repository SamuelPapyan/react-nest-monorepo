import SideBar from "../common/SideBar";
import AuthPanel from "./auth/AuthPanel";
import { Outlet } from "react-router";
import '../../style/App.css';
import AuthService from "../../services/authService";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setStaffCredentials } from '../../store/authSlice'

export default function AdminBody(props) {
    const dispatch = useDispatch()
    const user = useSelector((state)=>state.auth.staffUser);
    const token = useSelector((state)=>state.auth.staffToken);

    useEffect(()=>{
        if (token && !user) {
            AuthService.getProfile().then(res=>{
                if (res.success) {
                    dispatch(setStaffCredentials({token, user: res.data}))
                }
            }).catch(console.error)
        }
        console.log(user);
    }, [user])
    return (
        <>
            <div className="text-center">
                <div className="splitted-screen"
                style={{
                    position: "sticky",
                    top: "0"
                }}>
                    <SideBar userData={user}/>
                    <div className="router-screen">
                        <AuthPanel changeLang={props.changeLang} user={user}/>
                        <Outlet context={user}/>
                    </div>
                </div>
            </div>
        </>
    )
}