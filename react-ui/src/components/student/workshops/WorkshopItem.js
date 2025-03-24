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
            <div className="col-xl-4 col-md-6 col-12">
                <div className="d-flex flex-xl-row flex-column flex-sm-column flex-xs-column justify-content-xl-between align-items-xl-center">
                    <div>
                        <img src={props.data.cover_photo ? props.data.cover_photo : "/images/no_image_landscape.jpeg"} alt="workshop_cover_photo" width="100%" height={250}/>
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
                        <div className="d-flex justify-content-between">
                            <p className="text-start">{props.data.start_time} - {props.data.end_time}</p>
                            {
                                props.data.students.some(x => x === props.data.studentName) ?
                                <h4 className="text-success">{t("textRegistered")}</h4> : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    )
}