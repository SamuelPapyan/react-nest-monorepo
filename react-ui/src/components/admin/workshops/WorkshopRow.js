import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import WorkshopsService from "../../../services/workshopsService";
import {useTranslation} from "react-i18next";
import WorkshopModal from "./WorkshopModal";

export default function WorkshopRow(props) {
    const {t} = useTranslation();
    const [workshopId, setWorkshopId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [count, setCount] = useState(0);
    const [students, setStudents] = useState(0);
    const [data, setData] = useState();
    const [showModal, setShowModal] = useState(false);

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
        setTitle(window.localStorage.getItem("react-nest-monorepo-lang") == "hy" ? props.data.title_hy : props.data.title_en);
        setDescription(window.localStorage.getItem("react-nest-monorepo-lang") == "hy" ? props.data.description_hy : props.data.description_en);
        setStartTime(props.data.start_time);
        setEndTime(props.data.end_time);
        setCount(props.data.days.length);
        setStudents(props.data.students ? props.data.students.length : 0);
        setData({
            title,
            description,
            startTime,
            endTime,
            count,
            students
        })
    }, [props.data._id, props.data.title, props.data.description, props.data.start_time, props.data.end_time, props.data.days.length, props.data.students])

    return (
        <>
            <WorkshopModal
                setUpdated={props.setUpdated}
                show={showModal}
                data={data}
                onHide={() => setShowModal(false)}
            />
            <tr>
                <td className="d-none d-lg-table-cell">{title}</td>
                <td className="d-table-cell d-lg-none">
                    <a href="#" className="text-primary pe-auto text-decoration-none" onClick={(e)=>{
                        e.preventDefault();
                        setShowModal(true);
                    }}>{title}</a>
                </td>
                <td className="d-none d-md-table-cell">{description}</td>
                <td className="d-none d-lg-table-cell">{startTime}</td>
                <td className="d-none d-lg-table-cell">{endTime}</td>
                <td className="d-none d-lg-table-cell">{count}</td>
                <td className="d-none d-lg-table-cell">{students}</td>
                {(props.userType === "ADMIN" || props.userType === "EDITOR") ? 
                <td>
                    <Link to={`/admin/workshops/edit/${workshopId}`} className="btn btn-primary">
                        <span className='d-none d-lg-inline'>{t("textEdit")}</span>
                        <img width="24px" height="24px" src="/images/edit_icon.svg" alt="delete_icon" className='d-inline d-lg-none'/>
                    </Link>
                </td>
                : ""}
                {props.userType === "ADMIN" ? 
                <td>
                <button className="btn btn-danger" onClick={removeWorkshop}>
                    <span className='d-none d-lg-inline'>{t("textDelete")}</span>
                    <img width="24px" height="24px" src="/images/delete_icon.svg" alt="delete_icon" className='d-inline d-lg-none'/>
                </button>
                </td>
                : ""}
            </tr>
        </>
    )
}