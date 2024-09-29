import AuthService from "../../../services/authService";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Login(props) {
    const {t} = useTranslation();
    const [box, setBox] = useState("")
    const [updated, setUpdated] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    let _username, _password, _email, _loginMessage, _emailMessage;

    function login(event) {
        event.preventDefault(); 
        const requestData = {
            username: _username.value,
            password: _password.value,
        };
        AuthService.login(requestData).then(res=>{
            if (res.success){
                window.localStorage.setItem(process.env.REACT_APP_ADMIN_TOKEN, res.data);
                props.setToken(true);
                if (location.state && location.state.from && !location.state.from !== '/login')
                    navigate(location.state.from)
                else
                    navigate('/admin');
            } else {
                _loginMessage.textContent = "Invalid username or password";
            }
        }).catch(err=>{
            _loginMessage.textContent ='Connection fault. Try again later.'; 
        });
    }

    function sendPasswordRecoveryMail(event) {
        event.preventDefault()
        AuthService.sendPasswordRecoveryMail(_email.value).then(res=>{
            if (res.success){
                setBox(boxes.sendMail)
            } else {
                _emailMessage.textContent = res.message
            }
        }).catch(err=>{
            _emailMessage.textContent = 'Connection fault. Try again later.'
        });
    }

    function switchToReset(event) {
        event.preventDefault()
        setBox(boxes.reset);
    }

    function backToLogin(event) {
        event.preventDefault()
        setBox(boxes.login);
    }

    const boxes = {
        login: (<>
            <h1 className="text-light text-center">{t("textStaffLogin")}</h1>
            <form method="POST" onSubmit={login}>
                <div className="form-group">
                    <label htmlFor="username-field" className="text-light">{t("labelUsername")}</label><br/>
                    <input className="form-control" id="username-field" type="text" name="username" ref={(a) => _username = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password-field" className="text-light">{t("labelPassword")}</label><br/>
                    <input className="form-control" id="password-field" type="password" name="password" ref={(a) => _password = a}/>
                </div>
                <p className="text-center text-light" ref={(a) => _loginMessage = a}></p>
                <div className="text-end">
                    <a href="/" onClick={switchToReset}>{t("textForgetPassword")}</a>
                </div>
                <input
                    type="submit"
                    value={t("textLogin")}
                    className="btn text-light"
                    style={{
                        display: "block",
                        backgroundColor: "#03045E",
                        margin: "auto"
                    }}/>
            </form>
            </>),
        reset: (<>
            <h1 className="text-light text-center">{t("textPasswordRecovery")}</h1>
            <form method="POST" onSubmit={sendPasswordRecoveryMail}>
                <div className="form-group">
                    <label htmlFor="email-field" className="text-light">{t("textResetPassEmail")}</label><br/>
                    <input className="form-control" id="email-field" type="text" name="email" ref={(a) => _email = a}/>
                </div>
                <p className="text-center text-light" ref={(a) => _emailMessage = a}></p>
                <div className="text-end">
                    <a href="/" onClick={backToLogin}>{t("textBackToLogin")}</a>
                </div>
                <input
                    type="submit"
                    value={t("textSendMail")}
                    className="btn text-light"
                    style={{
                        display: "block",
                        backgroundColor: "#03045E",
                        margin: "auto"
                    }}/>
            </form>
            </>),
        sendMail: (<>
            <h1 className="text-center text-light">{t("textMailSent")}</h1>
            <p className="text-center text-light">{t("textMailSentMessage")}</p>
        </>)
    }

    useEffect(()=>{
        if (!updated) {
            document.title = t("textStaffLogin");
            setBox(boxes.login);
            setUpdated(true);
        }
    }, [updated, boxes.login]);

    return (
        <div style={{
            width:"100%",
            height: "737px",
            backgroundColor: "#0196C7"
        }} className="d-flex justify-content-center align-items-center">
            <div style={{
                width: "30%",
                backgroundColor: "#033E8A"
            }} className="rounded p-2">
                {box}
            </div>
            
        </div>
    )
}