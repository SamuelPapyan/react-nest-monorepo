import { Link } from "react-router-dom";
import WorkshopsTable from "./WorkshopTable";
import { useEffect, useState } from "react";
import WorkshopsServices from "../../../services/workshopsService";
import AuthService from "../../../services/authService";
import SearchBar from "../SearchBar";
import { useTranslation } from "react-i18next";

export default function WorkshopsList() {
    const {t} = useTranslation();
    const [data, setData] = useState(null);
    const [connected, setConnected] = useState(true);
    const [updated, setUpdated] = useState(false);
    const [userType, setUserType] = useState("VIEWER");

    useEffect(()=>{
        if (!updated) {
            document.title = "Workshops List";
            WorkshopsServices.getAllWorkshops().then(res=>{
                if (res.success) {
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