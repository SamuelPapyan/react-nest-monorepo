import { Link } from "react-router-dom";
import StaffTable from "./StaffTable";
import { useState, useEffect } from "react";
import StaffService from "../../../services/staffService";
import SearchBar from "../SearchBar";
import AuthService from "../../../services/authService";

export default function StaffList()
{
    const [data, setData] = useState(null);
    const [updated, setUpdated] = useState(false);
    const [connected, setConnected] = useState(true);
    const [userType, setUserType] = useState("VIEWER");

    useEffect(()=>{
        if (!updated) {
            document.title = "Staff List";
            StaffService.getAllStaffs().then(res=>{
                if (res.success){
                    setData(res.data);
                }
                AuthService.getProfile().then(res=>{
                    if (res.success) {
                        if (res.data.role === 'editor') {
                            setUserType("EDITOR");
                        }
                        if (res.data.role === 'admin') {
                            setUserType("ADMIN");
                        }
                    }
                }).catch((err)=>{
                    console.error(err);
                    setConnected(false);
                }).finally(()=>{
                    setUpdated(true);
                })
            }).catch((err)=>{
                console.error(err);
                setConnected(false);
            });
        }
    });

    function searchCallback(newData) {
        setData(newData);
    }

    return (
        <div id="staffs-list-body" style={{
            margin:"0 30px"
        }}>
            <h1>Staff List</h1>
            <SearchBar searchFunc="staff" cb={searchCallback}/>
            <StaffTable data={data} connected={connected} userType={userType}/>
            {userType === "ADMIN" ? <Link to="/admin/staff/create" className="btn btn-primary">Create</Link> : ""}
        </div>
    )
}