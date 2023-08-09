import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import UserService from "../../services/userService";

export default function UserRow(props)
{
    const [userId, setUserId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [roles, setRoles] = useState("");

    const navigate = useNavigate();

    async function removeUser() {
        try {
            const res = await UserService.deleteUser(userId);
            if (res.success)
                window.location.reload();
            else
                alert("You don't have permission to delete a user");
        }
        catch (err){
            navigate('/error');
        }
    }

    useEffect(()=>{
        setUserId(props.data._id);
        setFirstName(props.data.first_name);
        setLastName(props.data.last_name);
        setEmail(props.data.email);
        setUsername(props.data.username);
        setPassword(props.data.password);
        setRoles(props.data.roles.map(value=>value.toUpperCase()).join(" | "));
    });

    return (
        <tr>
            <td>{firstName}</td>
            <td>{lastName}</td>
            <td>{email}</td>
            <td>{username}</td>
            <td>{password}</td>
            <td>{roles}</td>
            <td>
                <Link to={`/users/edit/${userId}`} className="btn btn-primary">Edit</Link>
            </td>
            <td>
                <button className='btn btn-danger' onClick={removeUser}>
                    Delete
                </button>
            </td>
        </tr>
    );
}