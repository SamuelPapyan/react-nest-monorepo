import React, { useState } from "react";
import AuthService from "../../services/authService";
import {Modal} from 'react-bootstrap'

export default function SignUpModal(props) {
    const [validationErrors, setValidationErrors] = useState([])
    let _firstName, _lastName, _email, _username, _password;

    function signUp(event) {
        event.preventDefault();
        const requestData = {
            first_name : _firstName.value,
            last_name : _lastName.value,
            email: _email.value,
            username: _username.value,
            password: _password.value
        }
        AuthService.signUp(requestData).then(res=>{
            if (res.success){
                props.hide();
                props.showLogin();
                setValidationErrors("");
            } else{
                if (res.validation_errors.length > 0){
                    const valErrors = res.validation_errors.map((value, index)=>{
                        return <li key={index}>{value}</li>
                    });
                    setValidationErrors(valErrors);
                }
            }
        }).catch(err=>{
            setValidationErrors(<li>Connection fault. Try again later.'</li>);
        });
    }

    function openLogInModal(event) {
        event.preventDefault();
        props.hide();
        props.showLogin();
    }

    return (
        <Modal show={props.show} onHide={props.hide} centered>
            <Modal.Body>
                <Modal.Title>Sign Up</Modal.Title>
                {validationErrors}
                <form method="POST" onSubmit={signUp}>
                    <div className="form-group">
                        <label htmlFor="first-name-field">First Name</label><br/>
                        <input className="form-control" id="first-name-field" type="text" name="first_name" ref={(a) => _firstName = a}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="last-name-field">Last Name</label><br/>
                        <input className="form-control" id="last-name-field" type="text" name="last_name" ref={(a) => _lastName = a}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email-field">Email</label><br/>
                        <input className="form-control" id="email-field" type="email" name="email" ref={(a) => _email = a}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="username-field">Username</label><br/>
                        <input className="form-control" id="username-field" type="text" name="username" ref={(a) => _username = a}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password-field">Password</label><br/>
                        <input className="form-control" id="password-field" type="password" name="password" ref={(a) => _password = a}/>
                    </div>
                    <br/>
                    <input type="submit" value="Sign Up" className="btn btn-primary"/>
                </form>
                <span>Already have an account? <a href="#" onClick={openLogInModal}>Log In</a></span>
            </Modal.Body>
        </Modal>
    )
}