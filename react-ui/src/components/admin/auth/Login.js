import AuthService from "../../../services/authService";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react";

export default function Login(props) {
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
                window.localStorage.setItem('REACT_NEST_MONOREPO_AUTH_TOKEN', res.data);
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
        console.log(_email.value);
        AuthService.sendPasswordRecoveryMail(_email.value).then(res=>{
            console.log(res)
            if (res.success){
                setBox(boxes.sendMail)
            } else {
                _emailMessage.textContent = res.message
            }
        }).catch(err=>{
            _loginMessage.textContent = 'Connection fault. Try again later.'
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
            <h1 className="text-light text-center">Admin Login</h1>
            <form method="POST" onSubmit={login}>
                <div className="form-group">
                    <label htmlFor="username-field" className="text-light">Username</label><br/>
                    <input className="form-control" id="username-field" type="text" name="username" ref={(a) => _username = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password-field" className="text-light">Password</label><br/>
                    <input className="form-control" id="password-field" type="password" name="password" ref={(a) => _password = a}/>
                </div>
                <p className="text-center text-light" ref={(a) => _loginMessage = a}></p>
                <div className="text-end">
                    <a href="/" onClick={switchToReset}>Forget Password?</a>
                </div>
                <input
                    type="submit"
                    value="Log In"
                    className="btn text-light"
                    style={{
                        display: "block",
                        backgroundColor: "#03045E",
                        margin: "auto"
                    }}/>
            </form>
            </>),
        reset: (<>
            <h1 className="text-light text-center">Reset Password</h1>
            <form method="POST" onSubmit={sendPasswordRecoveryMail}>
                <div className="form-group">
                    <label htmlFor="email-field" className="text-light">Type your email to send your email receiving</label><br/>
                    <input className="form-control" id="email-field" type="text" name="email" ref={(a) => _email = a}/>
                </div>
                <p className="text-center text-light" ref={(a) => _emailMessage = a}></p>
                <div className="text-end">
                    <a href="/" onClick={backToLogin}>Back to Login</a>
                </div>
                <input
                    type="submit"
                    value="Send Email"
                    className="btn text-light"
                    style={{
                        display: "block",
                        backgroundColor: "#03045E",
                        margin: "auto"
                    }}/>
            </form>
            </>),
        sendMail: (<>
            <h1 className="text-center text-light">Mail has been sent</h1>
            <p className="text-center text-light">Check your email to get password reset link.</p>
        </>)
    }

    useEffect(()=>{
        if (!updated) {
            document.title = "Admin Login";
            setBox(boxes.login);
            setUpdated(true);
        }
    }, [updated, boxes.login]);

    return (<div style={{
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