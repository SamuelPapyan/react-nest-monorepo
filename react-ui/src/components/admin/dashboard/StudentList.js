import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";

export default function StudentList(props) {
    const {t} = useTranslation();
    const [rows, setRows] = useState([])

    useEffect(()=>{
        setRows(props.data.map(elem=>{
            return (
                <tr>
                    <td>{elem.full_name}</td>
                    <td>{elem.level}</td>
                    <td>{elem.experience}</td>
                </tr>
            )
        }))
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