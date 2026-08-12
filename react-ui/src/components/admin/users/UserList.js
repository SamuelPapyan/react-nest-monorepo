import { Link } from "react-router-dom";
import UserTable from './UserTable';
import { useState, useEffect} from "react";
import UserService from "../../../services/userService";
import SearchBar from "../SearchBar";
import { useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";

export default function UserList()
{
    const {t} = useTranslation();
    const [updated, setUpdated] = useState(false);
    const [data, setData] = useState(null);
    const [connected, setConnected] = useState(true);
    const [userType, setUserType] = useState("VIEWER");
    const userData = useOutletContext();

    useEffect(()=>{
        if (!updated) {
            document.title = t("textStaffList");
            UserService.getAllStaff().then(res=>{
                if (res.success){
                    setData(res.data);
                }
                if (userData) {
                    if (userData.role === 'editor') setUserType("EDITOR");
                    if (userData.role === 'admin') setUserType("ADMIN");
                }
                setUpdated(true);
            }).catch((err)=>{
                console.error(err);
                setConnected(false);
            })
        }
    });

    function searchCallback(newData) {
        setData(newData);
    }

    return (
        <div id="staff-list-body" style={{
            margin:"0 30px"
        }}>
            <h1>{t("textStaffList")}</h1>
            <SearchBar searchFunc="users" cb={searchCallback}/>
            <UserTable data={data} connected={connected} userType={userType}/>
            {userType === "ADMIN" ? <Link to="/admin/staff/create" className="btn btn-primary">{t("textCreate")}</Link> : ""}
        </div>
    )
}