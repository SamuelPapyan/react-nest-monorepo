import StudentSidebar from "./StudentSidebar"
import StudentAuthPanel from './StudentAuthPanel'
import StudentService from '../../services/studentService';
import { Outlet } from "react-router"
import ChatBox from "../common/ChatBox";
import { useSelector, useDispatch } from 'react-redux';
import { setStudentCredentials } from '../../store/authSlice'
import { useEffect } from 'react'

import '../../style/App.css';

export default function StudentBody(props) {
    const dispatch = useDispatch();
    const user = useSelector((state)=>state.auth.studentUser);
    const token = useSelector((state)=>state.auth.studentToken);

    useEffect(()=>{
        if (token && !user) {
            StudentService.getProfile().then(res=>{
                if (res.success) {
                    dispatch(setStudentCredentials({token, user: res.data}))
                }
            }).catch(console.error)
        }
    }, [user])

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
                        <StudentAuthPanel data={user} changeLang={props.changeLang}/>
                        <Outlet context={user}/>
                    </div>
                </div>
            </div>
            {user ? 
            <ChatBox
            styles={{
                primaryColor: "#198754"
            }}
            type="dm"
            isStaff={false}
            user={user?.username}
            userId={user?._id}
            coach={user?.coach}/>
            : ""}
        </>
    )
}