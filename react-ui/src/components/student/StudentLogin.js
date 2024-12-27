import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentService from "../../services/studentService"
import { useTranslation } from "react-i18next";

export default function StudentLogin(props) {
    let _username, _password, _loginMessage, _emailMessage, _email;

    const { t } = useTranslation();
    const [updated, setUpdated] = useState(false);
    const [box, setBox] = useState("");
    const location = useLocation()
    const navigate = useNavigate()

    const boxes = {
        login: (<>
            <h1 className="text-center">{t('textLogin')}</h1>
            <br/>
            <form method="POST" onSubmit={login}>
                <div className="form-group">
                    <input placeholder={t("labelUsername")} className="form-control" id="username-field" type="text" name="username" ref={(a) => _username = a}/>
                </div>
                <br/>
                <div className="form-group">
                    <input placeholder={t("labelPassword")} className="form-control" id="password-field" type="password" name="password" ref={(a) => _password = a}/>
                </div>
                <p className="text-center text-dark" ref={a=> _loginMessage = a}></p>
                <div className="text-end">
                    <a href="/" onClick={switchToReset}>{t("textForgetPassword")}</a>
                </div>
                <input
                    type="submit"
                    value={t("textLogin")}
                    className="btn btn-success"
                    style={{
                        display: "block",
                        margin: "auto"
                    }}/>
            </form>
        </>),
        reset: (<>
            <h1 className="text-center">{t('textLogin')}</h1>
            <br/>
            <form method="POST" onSubmit={sendPasswordRecoveryMail}>
                <div className="form-group">
                    <input placeholder={t("labelEmail")} className="form-control" id="email-field" type="text" name="email" ref={(a) => _email = a}/>
                </div>
                <br/>
                <p className="text-center text-dark" ref={a=> _emailMessage = a}></p>
                <div className="text-end">
                    <a href="/" onClick={backToLogin}>{t("textBackToLogin")}</a>
                </div>
                <input
                    type="submit"
                    value={t("textSendMail")}
                    className="btn btn-success"
                    style={{
                        display: "block",
                        margin: "auto"
                    }}/>
            </form>
        </>),
        sendMail: (<>
            <h1 className="text-center text-light">{t('textMailSent')}</h1>
            <p className="text-center text-light">{t('textMailSentMessage')}</p>
        </>)
    }

    function login(event){
        event.preventDefault();
        StudentService.login(_username.value, _password.value).then(res=>{
            if (res.success) {
                window.localStorage.setItem(process.env.REACT_APP_STUDENT_TOKEN, res.data)
                props.setToken(true);
                if (location.state && location.state.from && !location.state.from !== '/login')
                    navigate(location.state.from)
                else
                    navigate('/');
            } else {
                _loginMessage.textContent = t('validationLogin');
            }
        }).catch(err=>{
            _loginMessage.textContent = "Connection fault. Try again later.";
        })
    }

    function switchToReset(event) {
        event.preventDefault();
        setBox(boxes.reset);
    }

    function backToLogin(event) {
        event.preventDefault();
        setBox(boxes.login);
    }

    function sendPasswordRecoveryMail(event) {
        event.preventDefault()
        StudentService.sendPasswordRecoveryMail(_email.value).then(res=>{
            if (res.success){
                setBox(boxes.sendMail)
            } else {
                _emailMessage.textContent = res.message;
            }
        }).catch(err=>{
            _emailMessage.textContent = "Connection fault. Try again later."
        })
    }
    
    useEffect(()=>{
        if (!updated) {
            document.title = t('textStudentLogin');
            setBox(boxes.login);
            setUpdated(true);
        }
    }, [updated, boxes.login])

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
                    {box}
            </div>
        </div>
    )
}