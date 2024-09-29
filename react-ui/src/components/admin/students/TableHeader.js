import React from "react";
import { useTranslation } from "react-i18next";

export default function TableHeader(props){
    const {t} = useTranslation();
    return (
        <thead>
            <tr>
                <th>{t("textFullName")}</th>
                <th>{t("labelUsername")}</th>
                <th>{t("labelEmail")}</th>
                <th>{t("labelAge")}</th>
                <th>{t("labelLevel")}</th>
                <th>{t("labelExperience")}</th>
                <th>{t("labelMaxExperience")}</th>
                <th>{t("labelCountry")}</th>
                <th>{t("textCoach")}</th>
                { (props.userType === "ADMIN" || props.userType === "EDITOR") ?
                <th colSpan={2}>{t("textAction")}</th>
                : ""}
            </tr>
        </thead>
    );
}