import { useState } from "react";

export default function StudentLogin() {
    let _username, _password;
    const [loginErrorMessage, setLoginErrorMessage] = useState('');

    function login(){

    }
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
                    <h1 className="text-center">Login</h1>
                    <br/>
                    <form method="POST" onSubmit={login}>
                        <div className="form-group">
                            <input placeholder="Username" className="form-control" id="username-field" type="text" name="username" ref={(a) => _username = a}/>
                        </div>
                        <br/>
                        <div className="form-group">
                            <input placeholder="Password" className="form-control" id="password-field" type="password" name="password" ref={(a) => _password = a}/>
                        </div>
                        <p className="text-center text-dark">{loginErrorMessage}</p>
                        <input
                            type="submit"
                            value="Log In"
                            className="btn btn-success"
                            style={{
                                display: "block",
                                margin: "auto"
                            }}/>
                    </form>
                </div>
            </div>
        </div>
    )
}