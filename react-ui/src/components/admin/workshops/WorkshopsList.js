import { Link } from "react-router-dom";
import WorkshopsTable from "./WorkshopTable";
import { useEffect, useState } from "react";
import WorkshopsServices from "../../../services/workshopsService";
import SearchBar from "../SearchBar";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";

export default function WorkshopsList() {
    const {t} = useTranslation();
    const [data, setData] = useState(null);
    const [connected, setConnected] = useState(true);
    const [updated, setUpdated] = useState(false);
    const [userType, setUserType] = useState("VIEWER");
    const userData = useOutletContext();

    useEffect(()=>{
        if (!updated) {
            document.title = t("textWorkshopsList");
            WorkshopsServices.getAllWorkshops().then(res=>{
                if (res.success) {
                    setData(res.data);
                }
                if (userData) {
                    if (userData.role === 'editor') setUserType("EDITOR");
                    if (userData.role === 'admin') setUserType("ADMIN");
                }
                setUpdated(true);
            }).catch((err)=>{
                setConnected(false);
            });
        }
    })

    function searchCallback(newData) {
        setData(newData);
    }

    return (
        <div id="workshops-list-body" style={{
            margin:"0 30px"
        }}>
            <h1>{t("textWorkshopsList")}</h1>
            <SearchBar searchFunc="workshops" cb={searchCallback}/>
            <WorkshopsTable data={data} connected={connected} userType={userType}/>
            {( userType === "ADMIN") ? <Link to="/admin/workshops/create" className="btn btn-primary">{t("textCreateWorkshop")}</Link> : ""}
        </div>
    )
}