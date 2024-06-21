import React, { useEffect, useState } from "react";
import AuthService from '../../../services/authService';
import StudentService from "../../../services/studentService";
import StudentList from "./StudentList";
import { socket } from "../../../socket";
import { useOutletContext } from "react-router";
import GroupChatView from "./GroupChatView";

export default function CoachDashboard(props) {
    const [data, setData] = useState(null);
    const [updated, setUpdated] = useState(false);
    const userData = useOutletContext();

    useEffect(()=>{
        socket.connect();
        return ()=>{
            socket.disconnect();
        }
    },[])

    useEffect(()=>{
        socket.on('hand up', function(res){
            const index = data.findIndex(value=>{
                return value['username'] === res.student
            })
            if (index > -1) {
                const newData = new Array(...data);
                newData[index].handUp = res.handUp;
                setData(newData);
            }
        })
        return ()=>{
            socket.off('hand up');
        }
    })

    useEffect(()=>{
        document.title = "Coach Dashboard"
        if (!updated) {
            if (window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)) {
                AuthService.getProfile().then(res=>{
                    if (res.success) {
                        StudentService.getStudentsByCoach(res.data.username).then(res=>{
                            if (res.success) {
                                setData(res.data);
                                setUpdated(true);
                            }
                        })
                    } else {
                        window.localStorage.removeItem(process.env.REACT_APP_ADMIN_TOKEN);
                    }
                })
              }
        }
    })

    return (
        <div>
            <StudentList data={data} userData={userData}/>
            <GroupChatView data={data} userData={userData}/>
        </div>
    )
}