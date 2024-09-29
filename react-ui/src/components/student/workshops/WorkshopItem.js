import { useState, useEffect } from "react";
import WorkshopModal from "./WorkshopModal";
import { useTranslation } from "react-i18next";

export default function WorkshopItem(props) {
    const [modalShow, setModalShow] = useState(false);
    const {t} = useTranslation();

    return (
        <>
            <WorkshopModal setUpdated={props.setUpdated} show={modalShow} data={props.data} onHide={() => setModalShow(false)}/>
            <div>
                <div className="d-flex justify-content-between align-items-center">
                    <h2>
                        <a href="#"
                            onClick={() => setModalShow(true)}
                            style={{
                                textDecoration: "none",
                            }}>{props.data.title}</a>
                    </h2>
                    {
                        props.data.students.some(x => x === props.data.studentName) ?
                        <h4 className="text-success">{t("textRegistered")}</h4> : ""
                    }
                </div>
                <p className="text-start">{props.data.start_time} - {props.data.end_time}</p>
            </div>
            
        </>
    )
}