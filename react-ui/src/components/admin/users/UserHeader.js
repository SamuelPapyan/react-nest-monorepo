import React from "react";
import {useTranslation} from "react-i18next";

export default function UserHeader(props) {
    const {t} = useTranslation();
    return (
        <thead>
            <tr>
                <th>{t("labelAvatarPhoto")}</th>
                <th className="d-none d-lg-table-cell">{t("labelFirstName")}</th>
                <th className="d-none d-lg-table-cell">{t("labelLastName")}</th>
                <th className="d-none d-lg-table-cell">{t("labelEmail")}</th>
                <th>{t("labelUsername")}</th>
                <th className="d-none d-lg-table-cell">{t("textRoles")}</th>
                {props.userType === "ADMIN" ? 
                <th colSpan={2}>{t("textAction")}</th>
                : ""}
            </tr>
        </thead>
    );
}