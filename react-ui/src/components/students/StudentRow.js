import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom"
import { useNavigate } from "react-router";
import StudentService from "../../services/studentService";

export default function StudentRow(props)
{
    const [studentId, setStudentId] = useState("");
    const [fullName, setFullName] = useState("");
    const [age, setAge] = useState(0);
    const [level, setLevel] = useState(0);
    const [experience, setExperience] = useState(0);
    const [maxExperience, setMaxExperience] = useState(0);
    const [country, setCountry] = useState("");

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
    });

    return (
        <tr>
            <td>{fullName}</td>
            <td>{age}</td>
            <td>{level}</td>
            <td>{experience}</td>
            <td>{maxExperience}</td>
            <td>{country}</td>
            <td>
                <Link to={`/students/edit/${studentId}`} className="btn btn-primary">Edit</Link>
            </td>
            <td>
                <button className="btn btn-danger" onClick={removeStudent}>
                    Delete
                </button>
            </td>
        </tr>
    );
}