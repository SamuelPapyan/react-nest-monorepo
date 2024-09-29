import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import AuthService from "../../../services/authService"
import {Link} from 'react-router-dom'
import { useTranslation } from "react-i18next";

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function ResetPassword(){
    const [updated, setUpdated] = useState(false)
    const [box, setBox] = useState("");
    const {t} = useTranslation();
    let _newPassword, _confirmPassword, _errorMessage, userId = "";
    const query = useQuery();

    function resetPassword(event) {
        event.preventDefault();
        if (_newPassword.value !== _confirmPassword.value) {
            _errorMessage.textContent = t("validationTwoFieldsIdentical");
            return ;
        }
        AuthService.resetPassword(userId, _newPassword.value).then(res=>{
            if (res.success) {
                setBox(boxes.finish)
            }
            else {
                _errorMessage.textContent = res.message
            }
        }).catch(err=>{
            _errorMessage.textContent = "Connection fault. Try again later.";
        })
    }

    const boxes = {
        loading: <>
            <p className="text-light text-center">{t("textLoading")}...</p>
        </>,
        invalid: <>
            <h1 className="text-light text-center">{t("textInvalidResetLink")}</h1>
            <p className="text-light text-center">{t("textInvalidResetLinkMessage")}</p>
        </>,
        reset: <>
            <h1 className="text-light text-center">{t("textPasswordRecovery")}</h1>
            <form method="POST" onSubmit={resetPassword}>
                <div className="form-group">
                    <label htmlFor="username-field" className="text-light">{t("labelNewPassword")}</label><br/>
                    <input className="form-control" id="username-field" type="password" name="new_password" ref={(a) => _newPassword = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password-field" className="text-light">{t("labelConfirmPassword")}</label><br/>
                    <input className="form-control" id="password-field" type="password" name="confirm_password" ref={(a) => _confirmPassword = a}/>
                </div>
                <p className="text-center text-light" ref={a => _errorMessage = a}></p>
                <input
                    type="submit"
                    value={t("textReset")}
                    className="btn text-light"
                    style={{
                        display: "block",
                        backgroundColor: "#03045E",
                        margin: "auto"
                    }}/>
            </form>
        </>,
        finish: (<>
            <h1 className="text-center text-light">{t("textPasswordReset")}</h1>
            <p className="text-center text-light">{t("textPasswordResetMessage")}</p>
            <div className="text-center">
                <Link to="/admin/login" className="btn btn-primary">{t("textBackToLogin")}</Link>
            </div>
        </>
        )
    }

    useEffect(()=>{
        if (!updated) {
            setBox(boxes.loading);
            if (!query.get("id")) {
                setBox(boxes.invalid)
            }
            else {
                AuthService.validateResetLink(query.get("id")).then(res=>{
                    if (res.success && res.data.isValid) {
                        setBox(boxes.reset);
                        userId = res.data.user_id;
                    }
                    else {
                        setBox(boxes.invalid);
                    }
                })
                setUpdated(true);
            }
        }
    })

    return(<div style={{
        width:"100%",
        height: "715px",
        backgroundColor: "#0196C7"
    }} className="d-flex justify-content-center align-items-center">
        <div style={{
            width: "30%",
            backgroundColor: "#033E8A"
        }} className="rounded p-2">
            {box}
        </div>
    </div>)
}