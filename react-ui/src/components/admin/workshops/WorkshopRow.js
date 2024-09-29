import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import WorkshopsService from "../../../services/workshopsService";
import {useTranslation} from "react-i18next";

export default function WorkshopRow(props) {
    const {t} = useTranslation();
    const [workshopId, setWorkshopId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [count, setCount] = useState(0);
    const [students, setStudents] = useState(0);

    const navigate = useNavigate();

    async function removeWorkshop() {
        try {
            const res = await WorkshopsService.deleteWorkshop(workshopId);
            if (res.success)
                window.location.reload();
        } catch {
            navigate('/error');
        }
    }

    useEffect(()=>{
        setWorkshopId(props.data._id);
        setTitle(props.data.title);
        setDescription(props.data.description);
        setStartTime(props.data.start_time);
        setEndTime(props.data.end_time);
        setCount(props.data.days.length);
        setStudents(props.data.students ? props.data.students.length : 0);
    }, [props.data._id, props.data.title, props.data.description, props.data.start_time, props.data.end_time, props.data.days.length, props.data.students])

    return (
        <tr>
            <td>{title}</td>
            <td>{description}</td>
            <td>{startTime}</td>
            <td>{endTime}</td>
            <td>{count}</td>
            <td>{students}</td>
            {(props.userType === "ADMIN" || props.userType === "EDITOR") ? 
            <td>
                <Link to={`/admin/workshops/edit/${workshopId}`} className="btn btn-primary">{t("textEdit")}</Link>
            </td>
            : ""}
            {props.userType === "ADMIN" ? 
            <td>
            <button className="btn btn-danger" onClick={removeWorkshop}>
                {t("textDelete")}
            </button>
            </td>
            : ""}
        </tr>
    )
}