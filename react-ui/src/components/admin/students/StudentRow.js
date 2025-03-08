import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom"
import { useNavigate } from "react-router";
import StudentService from "../../../services/studentService";
import { useTranslation } from "react-i18next";
import StudentModal from "./StudentModal";

export default function StudentRow(props)
{
    const {t} = useTranslation();

    const [studentId, setStudentId] = useState("");
    const [fullName, setFullName] = useState("");
    const [age, setAge] = useState(0);
    const [level, setLevel] = useState(0);
    const [experience, setExperience] = useState(0);
    const [maxExperience, setMaxExperience] = useState(0);
    const [country, setCountry] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [coach, setCoach] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [avatar, setAvatar] = useState("/images/user.png");
    const [data, setData] = useState(null);

    const navigate = useNavigate();

    async function removeStudent(){
        try{
            const res = await StudentService.deleteStudent(studentId);
            if (res.success)
                window.location.reload();
        }
        catch {
            navigate('/error');
        }
    }

    useEffect(()=>{
        setStudentId(props.data._id);
        setFullName(window.localStorage.getItem("react-nest-monorepo-lang") == 'hy' ? props.data.full_name_hy : props.data.full_name_en);
        setAge(props.data.age);
        setLevel(props.data.level);
        setExperience(props.data.experience);
        setMaxExperience(props.data.max_experience);
        setCountry(props.data.country);
        setUsername(props.data.username);
        setEmail(props.data.email);
        setCoach(props.data.coach);
        setData(props.data);
        if (props.data.avatar) setAvatar(props.data.avatar);
    }, [props.data._id, props.data.full_name_en, props.data.full_name_hy, props.data.age, props.data.level, props.data.experience, props.data.max_experience, props.data.country, props.data.username, props.data.email]);
    return (
        <>
            <StudentModal 
                setUpdated={props.setUpdated}
                show={showModal}
                data={data}
                onHide={() => setShowModal(false)}
            />
            <tr>
                <td>
                    <img width="50" src={avatar} alt="avatar_photo"/>
                </td>
                <td className="d-none d-lg-table-cell">{fullName}</td>
                <td className="d-table-cell d-lg-none">
                    <a href="#" className="text-primary pe-auto text-decoration-none" onClick={(e)=>{
                        e.preventDefault();
                        setShowModal(true);
                    }}>{username}</a>
                </td>
                <td className="d-md-table-cell d-none">{username}</td>
                <td className="d-none d-md-table-cell">{email}</td>
                <td className="d-none d-xl-table-cell">{age}</td>
                <td className="d-none d-xl-table-cell">{level}</td>
                <td className="d-none d-xl-table-cell">{experience}</td>
                <td className="d-none d-xl-table-cell">{maxExperience}</td>
                <td className="d-none d-xl-table-cell">{country}</td>
                <td className="d-none d-md-table-cell">{coach}</td>
                {(props.userType === "ADMIN" || props.userType === "EDITOR") ? 
                <td>
                    <Link to={`/admin/students/edit/${studentId}`} className="btn btn-primary">
                        <span className='d-none d-xl-inline'>{t("textEdit")}</span>
                        <img width="24px" height="24px" src="/images/edit_icon.svg" alt="delete_icon" className='d-inline d-xl-none'/>
                    </Link>
                </td>
                : ""}
                {props.userType === "ADMIN" ? 
                <td>
                <button className="btn btn-danger" onClick={removeStudent}>
                    <span className='d-none d-xl-inline'>{t("textDelete")}</span>
                    <img width="24px" height="24px" src="/images/delete_icon.svg" alt="delete_icon" className='d-inline d-xl-none'/>
                </button>
                </td>
                : ""}
            </tr>
        </>
    );
}