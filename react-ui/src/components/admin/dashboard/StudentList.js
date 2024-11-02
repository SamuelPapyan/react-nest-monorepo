import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { OrbitProgress } from 'react-loading-indicators'

export default function StudentList(props) {
    const {t} = useTranslation();
    const [rows, setRows] = useState(
        <OrbitProgress variant="disc" dense color="#005CA9" size="medium" text="" textColor="" />
    )

    useEffect(()=>{
        if (props.data.length) {
            setRows(props.data.map((elem, index)=>{
                return (
                    <tr key={index}>
                        <td>{elem.full_name}</td>
                        <td>{elem.level}</td>
                        <td>{elem.experience}</td>
                    </tr>
                )
            }))
        }
    }, [props.data]);

    return (
        <div>
            <h2>{t("textBestStudents")}</h2>
            <table className="table table-bordered border-primary w-75 m-auto">
                <thead>
                    <tr>
                        <th><b>{t("textFullName")}</b></th>
                        <th><b>{t("labelLevel")}</b></th>
                        <th><b>{t("textExperience")}</b></th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )
}