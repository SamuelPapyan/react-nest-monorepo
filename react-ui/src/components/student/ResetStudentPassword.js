import React, { useEffect, useState } from "react"
import { useLocation } from "react-router";
import StudentService from "../../services/studentService";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function useQuery() {
    const {search} = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function ResetStudentPassword() {
    const [updated, setUpdated] = useState(false);
    const [box, setBox] = useState("");
    let _newPassword, _confirmPassword, _errorMessage, userId = "";
    const query = useQuery();
    const {t} = useTranslation();
    
    const boxes = {
        loading: <>
            <p className="text-dark text-center">{t("textLoading")}...</p>
        </>,
        invalid: <>
            <h1 className="text-dark text-center">{t("textInvalidResetLink")}</h1>
            <p className="text-dark text-center">{t("textInvalidResetLinkMessage")}</p>
        </>,
        reset: <>
            <h1 className="text-center">{t('textPasswordRecovery')}</h1>
            <br/>
            <form method="POST" onSubmit={resetPassword}>
                <div className="form-group">
                    <input placeholder={t('labelNewPassword')} className="form-control" id="new-password-field" type="password" name="new_password" ref={(a) => _newPassword = a}/>
                </div>
                <br/>
                <div className="form-group">
                    <input placeholder={t('labelConfirmPassword')} className="form-control" id="confirm-password-field" type="password" name="confirm_password" ref={(a) => _confirmPassword = a}/>
                </div>
                <br/>
                <p className="text-center text-dark" ref={a=> _errorMessage = a}></p>
                <input
                    type="submit"
                    value={t("textReset")}
                    className="btn btn-success"
                    style={{
                        display: "block",
                        margin: "auto"
                    }}/>
            </form>
        </>,
        finish: (<>
            <h1 className="text-center text-dark">{t("textPasswordReset")}</h1>
            <p className="text-center text-dark">{t("textPasswordResetMessage")}</p>
            <div className="text-center">
                <Link to="/login" className="btn btn-success">{t("textBackToLogin")}</Link>
            </div>
        </>)
    }

    function resetPassword(event) {
        event.preventDefault();
        if (_newPassword.value !== _confirmPassword.value) {
            _errorMessage.textContent = t("validationTwoFieldsIdentical");
            return ;
        }
        StudentService.resetPassword(userId, _newPassword.value).then(res=>{
            if (res.success) {
                setBox(boxes.finish)
            } else {
                _errorMessage.textContent = res.message
            }
        }).catch(err=>{
            _errorMessage.textContent = "Connection fault. Try again later.";
        })
    }

    useEffect(()=>{
        if (!updated) {
            setBox(boxes.loading);
            if (!query.get("id")) {
                setBox(boxes.invalid)
            }
            else {
                StudentService.validateResetLink(query.get("id")).then(res=>{
                    if (res.success && res.data.isValid) {
                        setBox(boxes.reset);
                        userId = res.data.user_id;
                    } else {
                        setBox(boxes.invalid);
                    }
                })
                setUpdated(true);
            }
        }
    })

    return (
        <div
            style={{
            width:"100%",
            height: "715px"
        }} className="d-flex justify-content-center align-items-center">
            <div className="rounded p-2" style={{
                width: "40%",
                backgroundColor: "#a1a1a1AA",
            }}>
                <div className="student-login" style={{
                    width:"600px",
                    padding: "10px"
                }}>
                    {box}
                </div>
            </div>
        </div>
    )
}