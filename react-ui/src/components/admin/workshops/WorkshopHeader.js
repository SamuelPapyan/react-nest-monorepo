import React from "react";
import {useTranslation} from "react-i18next"

export default function WorkshopHeader(props) {
    const {t} = useTranslation();
    return (
        <thead>
            <tr>
                <th>{t("labelWorkshopTitle")}</th>
                <th>{t("labelDescription")}</th>
                <th className="d-none d-lg-table-cell">{t("labelWorkshopStartTime")}</th>
                <th className="d-none d-lg-table-cell">{t("labelWorkshopEndTime")}</th>
                <th className="d-none d-lg-table-cell">{t("textCountOfDays")}</th>
                <th className="d-none d-lg-table-cell">{t("textRegisteredStudents")}</th>
                { (props.userType === "ADMIN" || props.userType === "EDITOR") ?
                <th colSpan={2}>{t("textAction")}</th>
                : ""}
            </tr>
        </thead>
    )
}