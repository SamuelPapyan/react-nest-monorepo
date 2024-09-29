import React from "react";
import {useTranslation} from "react-i18next";

export default function UserHeader(props) {
    const {t} = useTranslation();
    return (
        <thead>
            <tr>
                <th>{t("labelFirstName")}</th>
                <th>{t("labelLastName")}</th>
                <th>{t("labelEmail")}</th>
                <th>{t("labelUsername")}</th>
                <th>{t("textRoles")}</th>
                {props.userType === "ADMIN" ? 
                <th colSpan={2}>{t("textAction")}</th>
                : ""}
            </tr>
        </thead>
    );
}