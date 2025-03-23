import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import UserService from "../../../services/userService";
import {useTranslation} from "react-i18next"
import UserModal from './UserModal';


export default function UserRow(props)
{
    const {t} = useTranslation();
    const [userId, setUserId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [roles, setRoles] = useState("");
    const [data, setData] = useState(null);
    const [avatar, setAvatar] = useState("/images/user.png");
    const [showModal, setShowModal] = useState(false);

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
        setFirstName(window.localStorage.getItem("react-nest-monorepo-lang") == 'hy' ? props.data.first_name_hy : props.data.first_name_en);
        setLastName(window.localStorage.getItem("react-nest-monorepo-lang") == 'hy' ? props.data.last_name_hy : props.data.last_name_en);
        setEmail(props.data.email);
        setUsername(props.data.username);
        setRoles(props.data.roles.map(value=>t("text" + value.toUpperCase())).join(" | "));
        setData({
            firstName, lastName, email, username, roles, avatar
        });
        if (props.data.avatar) setAvatar(props.data.avatar);
    }, [props.data._id, props.data.first_name, props.data.last_name, props.data.email, props.data.username, props.data.roles]);

    return (
        <>
            <UserModal 
                setUpdated={props.setUpdated}
                show={showModal}
                data={data}
                onHide={() => setShowModal(false)}
            />
            <tr>
                <td>
                    <img width="50" src={avatar} alt="avatar_photo"/>
                </td>
                <td className="d-none d-lg-table-cell">{firstName}</td>
                <td className="d-none d-lg-table-cell">{lastName}</td>
                <td className="d-none d-lg-table-cell">{email}</td>
                <td className='d-none d-lg-table-cell'>{username}</td>
                <td className="d-table-cell d-lg-none">
                    <a href="#" className="text-primary pe-auto text-decoration-none" onClick={(e)=>{
                        e.preventDefault();
                        setShowModal(true);
                    }}>{username}</a>
                </td>
                <td className="d-none d-lg-table-cell">{roles}</td>
                { props.userType === "ADMIN" ?
                <td>
                    <Link to={`/admin/users/edit/${userId}`} className='btn btn-primary'>
                    <span className='d-none d-lg-inline'>{t("textEdit")}</span>
                    <img width="24px" height="24px" src="/images/edit_icon.svg" alt="delete_icon" className='d-inline d-lg-none'/>
                    </Link>
                </td>
                : ""}
                { props.userType === "ADMIN" ?
                <td>
                    <button className='btn btn-danger' onClick={removeUser}>
                        <span className='d-none d-lg-inline'>{t("textDelete")}</span>
                        <img width="24px" height="24px" src="/images/delete_icon.svg" alt="delete_icon" className='d-inline d-lg-none'/>
                    </button>
                </td>
                : ""}
            </tr>
        </>
    );
}