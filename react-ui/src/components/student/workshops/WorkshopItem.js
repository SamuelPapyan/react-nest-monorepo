import { useState, useEffect } from "react";
import WorkshopModal from "./WorkshopModal";
import { useTranslation } from "react-i18next";

export default function WorkshopItem(props) {
    const [modalShow, setModalShow] = useState(false);
    const {t} = useTranslation();

    return (
        <>
            <WorkshopModal
                setUpdated={props.setUpdated}
                show={modalShow}
                data={props.data}
                onHide={() => setModalShow(false)}
            />
            <div className="col-xl-12 col-md-6 col-12">
                <div className="d-flex flex-xl-row flex-column flex-sm-column flex-xs-column justify-content-xl-between align-items-xl-center">
                    <h2>
                        <a href="#"
                            onClick={() => setModalShow(true)}
                            style={{
                                textDecoration: "none",
                            }}>{
                                window.localStorage.getItem("react-nest-monorepo-lang") == 'hy' ?
                                props.data.title_hy :
                                props.data.title_en}</a>
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