import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom"
import { useNavigate } from "react-router";
import StudentService from "../../../services/studentService";
import { useTranslation } from "react-i18next";

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
        setFullName(props.data.full_name);
        setAge(props.data.age);
        setLevel(props.data.level);
        setExperience(props.data.experience);
        setMaxExperience(props.data.max_experience);
        setCountry(props.data.country);
        setUsername(props.data.username);
        setEmail(props.data.email);
        setCoach(props.data.coach);
    }, [props.data._id, props.data.full_name, props.data.age, props.data.level, props.data.experience, props.data.max_experience, props.data.country, props.data.username, props.data.email]);

    return (
        <tr>
            <td>{fullName}</td>
            <td>{username}</td>
            <td>{email}</td>
            <td>{age}</td>
            <td>{level}</td>
            <td>{experience}</td>
            <td>{maxExperience}</td>
            <td>{country}</td>
            <td>{coach}</td>
            {(props.userType === "ADMIN" || props.userType === "EDITOR") ? 
            <td>
                <Link to={`/admin/students/edit/${studentId}`} className="btn btn-primary">{t("textEdit")}</Link>
            </td>
            : ""}
            {props.userType === "ADMIN" ? 
            <td>
            <button className="btn btn-danger" onClick={removeStudent}>
                {t("textDelete")}
            </button>
            </td>
            : ""}
        </tr>
    );
}