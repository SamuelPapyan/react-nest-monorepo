import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom";
import StudentService from "../../../services/studentService";
import WorkshopItem from "./WorkshopItem";
import { useTranslation } from "react-i18next";
import {OrbitProgress} from 'react-loading-indicators'

export default function WorkshopsList() {
    const {t} = useTranslation();
    const [updated, setUpdated] = useState(false);
    const [data, setData] = useState(<>
        <OrbitProgress variant="disc" dense color="#198754" size="medium" text="" textColor="" />
        <p>{t("textLoading")}...</p>
    </>);
    const studentData = useOutletContext();

    useEffect(()=>{
        document.title = t("textWorkshops");
        if (!updated) {
            StudentService.getWorkshops().then((res)=>{
                if (res.success) {
                    const arr = res.data.map(elem=>{
                        return <WorkshopItem key={elem._id} setUpdated={setUpdated} data={{...elem, studentName: studentData.username}}/>
                    })
                    setData(arr);
                    setUpdated(true);
                }
            }).catch(e=>{
    
            })
        }
    });

    return (
        <div style={{
            margin: "0 30px"
        }}>
            <h1 className="text-center">{t("textWorkshops")}</h1>
            {data}
        </div>
    )
}