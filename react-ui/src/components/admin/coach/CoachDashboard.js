import React, { useEffect, useState } from "react";
import StudentService from "../../../services/studentService";
import StudentList from "./StudentList";
import { useOutletContext } from "react-router";
import GroupChatView from "./GroupChatView";
import { useTranslation } from "react-i18next";
import { io } from 'socket.io-client'

const URL = 'http://localhost:2023';

const socket = io(URL);

export default function CoachDashboard(props) {
    const {t} = useTranslation();
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
        document.title = t("textCoachDashboard")
        if (!updated) {
            if (userData) {
                StudentService.getStudentsByCoach(userData._id).then(res=>{
                    if (res.success) {
                        setData(res.data);
                        setUpdated(true);
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