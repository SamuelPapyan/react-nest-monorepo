import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import UserService from "../../../services/userService";
import {useTranslation} from "react-i18next"

export default function UserRow(props)
{
    const {t} = useTranslation();
    const [userId, setUserId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
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
        setRoles(props.data.roles.map(value=>t("text" + value.toUpperCase())).join(" | "));
    }, [props.data._id, props.data.first_name, props.data.last_name, props.data.email, props.data.username, props.data.roles]);

    return (
        <tr>
            <td>{firstName}</td>
            <td>{lastName}</td>
            <td>{email}</td>
            <td>{username}</td>
            <td>{roles}</td>
            { props.userType === "ADMIN" ?
            <td>
                <Link to={`/admin/users/edit/${userId}`} className='btn btn-primary'>{t("textEdit")}</Link>
            </td>
            : ""}
            { props.userType === "ADMIN" ?
            <td>
                <button className='btn btn-danger' onClick={removeUser}>
                    {t("textDelete")}
                </button>
            </td>
            : ""}
        </tr>
    );
}