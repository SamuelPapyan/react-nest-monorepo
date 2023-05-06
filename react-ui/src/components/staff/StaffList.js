import { Link } from "react-router-dom";
import StaffTable from "./StaffTable";
import { useState, useEffect } from "react";
import StaffService from "../../services/staffService";

export default function StaffList()
{
    const [data, setData] = useState(null);
    const [connected, setConnected] = useState(true);

    useEffect(()=>{
        document.title = "Staff List";
        StaffService.getAllStaffs().then(res=>{
            if (res.success){
                setData(res.data);
            }
        }).catch(()=>{
            setConnected(false);
        })
    });

    return (
        <div id="staffs-list-body">
            <h1>Staff List</h1>
            <StaffTable data={data} connected={connected}/>
            <Link to="/staff/create" className="btn btn-primary">Create</Link>
        </div>
    )
}