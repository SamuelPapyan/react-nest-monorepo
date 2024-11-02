import { useEffect, useState } from "react"
import StudentService from "../../services/studentService";
import { useOutletContext } from "react-router";
import {useTranslation} from "react-i18next";
import {OrbitProgress} from 'react-loading-indicators'

export default function StudentDashboard() {
    const {t} = useTranslation();
    const [updated, setUpdated] = useState(false);
    const [workshops, setWorkshops] = useState(<>
        <OrbitProgress variant="disc" dense color="#198754" size="medium" text="" textColor="" />
        <p>{t("textLoading")}...</p>
    </>)
    const studentData = useOutletContext();
    
    useEffect(()=>{
        document.title = t("textStudentDashboard");
        if (!updated && studentData)
        StudentService.getRegisteredWorkshops(studentData.username).then(res=>{
            if (res.success) {
                const arr = res.data.map((value, index)=>{
                    return (<h3 className="text-start text-success" key={index}>{value.title}</h3>)
                })
                setWorkshops(arr);
                setUpdated(true);
            }
        })
    })

    return (<div style={{
        margin: "0 30px",
    }}>
        <h1>{t("textWelcomeToDashboard")}</h1>
        <h2>{t("textRegisteregWorkshops")}</h2>
        {workshops}
    </div>)
}