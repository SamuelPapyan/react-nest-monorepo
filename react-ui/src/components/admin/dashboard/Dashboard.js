import DataCard from "./DataCard"
import DashboardService from "../../../services/dashboardService"
import StudentList from "./StudentList"
import { useTranslation } from "react-i18next";

import { useEffect, useState } from "react"

export default function Dashboard() {
    const {t} = useTranslation();
    const [studentCount, setStudentCount] = useState("")
    const [staffCount, setStaffCount] = useState("")
    const [workshopsCount, setWorkshopsCount] = useState("");
    const [bestStudents, setBestStudents] = useState([])
    const [updated, setUpdated] = useState(false);

    const oldBody = <div className="dashboard">
        <img src="images/images.png"/>
        <h1 className="text-primary">{t("textWelcomeToStaffDashboard")}</h1>
    </div>

    useEffect(()=>{
        document.title = t("textDashboard");
        if (!updated) {
            DashboardService.getDashboardData().then(res=>{
                setStudentCount(res.studentsCount);
                setStaffCount(res.staffCount);
                setWorkshopsCount(res.workshopsCount);
                setBestStudents(res.bestStudents);
            });
            setUpdated(true);
        }
    }, [updated])

    return (
        <div style={{
            margin: "auto",
            marginBottom: "50px",
            width: "90%",
        }}>
            {oldBody}
            <div className="d-flex row justify-content-center p-3" style={{
                margin: "auto",
                width: "100%"
            }}>
                <DataCard data={{title: t("textStudents"), count: studentCount}}/>
                <DataCard data={{title: t("textStaff"), count: staffCount}}/>
                <DataCard data={{title: t("textWorkshops"), count: workshopsCount}}/>
            </div>
            <StudentList data={bestStudents}/>
        </div>
        
    )
}