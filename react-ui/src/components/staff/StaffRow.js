import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import StaffService from "../../services/staffService";

export default function StaffRow(props)
{
    const [staffId, setStaffId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function removeStaff(){
        try{
            const res = await StaffService.deleteStaff(staffId);
            if (res.success)
            window.location.reload();
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
        setPassword(props.data.password);
    });

    return (
        <tr>
            <td>{firstName}</td>
            <td>{lastName}</td>
            <td>{email}</td>
            <td>{username}</td>
            <td>{password}</td>
            <td>
                <Link to={`/staff/edit/${staffId}`} className='btn btn-primary'>Edit</Link>
            </td>
            <td>
                <button className='btn btn-danger' onClick={removeStaff}>
                    Delete
                </button>
            </td>
        </tr>
    );
}