import { useState } from "react"
import { useTranslation } from "react-i18next";

export default function StudentRow(props) {
    const {t} = useTranslation();
    const [hidden, setHidden] = useState(false);

    return (
        <>
            {!hidden ? (<div className='d-flex justify-content-between'>
            <p>{props.value}</p>
            <button className='btn btn-danger' onClick={(e)=> {
                e.preventDefault();
                setHidden(true);
                props.remove(props.value)
            }}>{t("textUnregister")}</button>
        </div>) : ""}
        </>
    )
}