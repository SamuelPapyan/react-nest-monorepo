import React, { useState } from "react";
import AuthService from "../../services/authService";
import {Modal} from 'react-bootstrap'

export default function LoginModal(props) {
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    let _username, _password;

    function login(event) {
        event.preventDefault(); 
        const requestData = {
            username: _username.value,
            password: _password.value,
        };
        AuthService.login(requestData).then(res=>{
            if (res.success){
                window.localStorage.setItem('REACT_NEST_MONOREPO_AUTH_TOKEN', res.data);
                window.location.reload();
            } else {
                setLoginErrorMessage('Invalid username or password.')
            }
        }).catch(err=>{
            setLoginErrorMessage('Connection fault. Try again later.')
        });
    }

    return (
        <Modal show={props.show} onHide={props.hide} centered>
            <Modal.Body>
                <Modal.Title>Log In</Modal.Title>
                <form method="POST" onSubmit={login}>
                    <div className="form-group">
                        <label htmlFor="username-field">Username</label><br/>
                        <input className="form-control" id="username-field" type="text" name="username" ref={(a) => _username = a}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password-field">Password</label><br/>
                        <input className="form-control" id="password-field" type="password" name="password" ref={(a) => _password = a}/>
                    </div>
                    <span>{loginErrorMessage}</span>
                    <br/>
                    <input type="submit" value="Log In" className="btn btn-primary"/>
                </form>
            </Modal.Body>
        </Modal>
    )
}