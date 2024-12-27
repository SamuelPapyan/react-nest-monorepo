import React from "react";
import {useTranslation} from "react-i18next"

export default function WorkshopHeader(props) {
    const {t} = useTranslation();
    return (
        <thead>
            <tr>
                <th>{t("labelWorkshopTitle")}</th>
                <th>{t("labelDescription")}</th>
                <th>{t("labelWorkshopStartTime")}</th>
                <th>{t("labelWorkshopEndTime")}</th>
                <th>{t("textCountOfDays")}</th>
                <th>{t("textRegisteredStudents")}</th>
                { (props.userType === "ADMIN" || props.userType === "EDITOR") ?
                <th colSpan={2}>{t("textAction")}</th>
                : ""}
            </tr>
        </thead>
    )
}