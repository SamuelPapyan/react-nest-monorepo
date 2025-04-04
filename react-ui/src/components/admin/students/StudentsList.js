import { Link } from "react-router-dom";
import StudentTable from "./StudentTable";
import { useState, useEffect } from "react";
import StudentService from "../../../services/studentService";
import AuthService from "../../../services/authService";
import SearchBar from "../SearchBar";
import { useTranslation } from "react-i18next";

export default function StudentsList()
{
    const {t} = useTranslation();
    const [data, setData] = useState(null);
    const [connected, setConnected] = useState(true);
    const [updated, setUpdated] = useState(false);
    const [userType, setUserType] = useState("VIEWER");
    
    useEffect(()=>{
        if (!updated) {
            document.title = t("textStudentsList");
            StudentService.getAllStudents().then(res=>{
                if (res.success){
                    setData(res.data);
                }
                AuthService.getProfile().then(res=>{
                    if (res.success) {
                        if (res.data.roles.includes('editor')) {
                            setUserType("EDITOR");
                        }
                        if (res.data.roles.includes('admin')) {
                            setUserType("ADMIN");
                        }
                    }
                }).catch((err)=>{
                    setConnected(false);
                }).finally(()=>{
                    setUpdated(true);
                })
            }).catch((err)=>{
                setConnected(false);
            });
        }
    });

    function searchCallback(newData) {
        setData(newData);
    }

    return (
        <div id="students-list-body" style={{
            margin:"0 30px"
        }}>
            <h1>{t("textStudentsList")}</h1>
            <SearchBar searchFunc="students" cb={searchCallback}/>
            <StudentTable data={data} connected={connected} userType={userType}/>
            {( userType === "ADMIN") ? <Link to="/admin/students/create" className="btn btn-primary">{t("textCreateStudent")}</Link> : ""}
        </div>
    );
}