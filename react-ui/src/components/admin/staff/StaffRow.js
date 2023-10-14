import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import StaffService from "../../../services/staffService";

export default function StaffRow(props)
{
    const [staffId, setStaffId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    const navigate = useNavigate();

    async function removeStaff(){
        try{
            const res = await StaffService.deleteStaff(staffId);
            if (res.success)
                window.location.reload();
            else
                alert("You don't have permission to delete a staff member.");
        }
        catch {
            navigate('/error');
        }
    }

    useEffect(()=>{
        setStaffId(props.data._id);
        setFirstName(props.data.first_name);
        setLastName(props.data.last_name);
        setEmail(props.data.email);
        setUsername(props.data.username);
    }, [props.data._id, props.data.first_name, props.data.last_name, props.data.email, props.data.username]);

    return (
        <tr>
            <td>{firstName}</td>
            <td>{lastName}</td>
            <td>{email}</td>
            <td>{username}</td>
            { props.userType === "ADMIN" ?
            <td>
                <Link to={`/admin/staff/edit/${staffId}`} className='btn btn-primary'>Edit</Link>
            </td>
            : ""}
            { props.userType === "ADMIN" ?
            <td>
                <button className='btn btn-danger' onClick={removeStaff}>
                    Delete
                </button>
            </td>
            : ""}
        </tr>
    );
}