import React from "react";
import { useTranslation } from "react-i18next";

export default function TableHeader(props){
    const {t} = useTranslation();
    return (
        <thead>
            <tr>
                <th>{t("textFullName")}</th>
                <th>{t("labelUsername")}</th>
                <th className="d-none d-md-table-cell">{t("labelEmail")}</th>
                <th className="d-none d-xl-table-cell">{t("labelAge")}</th>
                <th className="d-none d-xl-table-cell">{t("labelLevel")}</th>
                <th className="d-none d-xl-table-cell">{t("labelExperience")}</th>
                <th className="d-none d-xl-table-cell">{t("labelMaxExperience")}</th>
                <th className="d-none d-xl-table-cell">{t("labelCountry")}</th>
                <th className="d-none d-md-table-cell">{t("textCoach")}</th>
                { (props.userType === "ADMIN" || props.userType === "EDITOR") ?
                <th colSpan={2}>{t("textAction")}</th>
                : ""}
            </tr>
        </thead>
    );
}