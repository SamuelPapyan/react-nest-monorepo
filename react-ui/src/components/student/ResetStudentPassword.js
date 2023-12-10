import React, { useEffect, useState } from "react"
import { useLocation } from "react-router";
import StudentService from "../../services/studentService";
import { Link } from "react-router-dom";

function useQuery() {
    const {search} = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function ResetStudentPassword() {
    const [updated, setUpdated] = useState(false);
    const [box, setBox] = useState("");
    let _newPassword, _confirmPassword, _errorMessage, userId = "";
    const query = useQuery();
    
    const boxes = {
        loading: <>
            <p className="text-dark text-center">Loading...</p>
        </>,
        invalid: <>
            <h1 className="text-dark text-center">Invalid Reset Link</h1>
            <p className="text-dark text-center">This link was expired or used or invalid.</p>
        </>,
        reset: <>
            <h1 className="text-center">Login</h1>
            <br/>
            <form method="POST" onSubmit={resetPassword}>
                <div className="form-group">
                    <input placeholder="New Password" className="form-control" id="new-password-field" type="password" name="new_password" ref={(a) => _newPassword = a}/>
                </div>
                <br/>
                <div className="form-group">
                    <input placeholder="Confirm Password" className="form-control" id="confirm-password-field" type="password" name="confirm_password" ref={(a) => _confirmPassword = a}/>
                </div>
                <br/>
                <p className="text-center text-dark" ref={a=> _errorMessage = a}></p>
                <input
                    type="submit"
                    value="Reset"
                    className="btn btn-success"
                    style={{
                        display: "block",
                        margin: "auto"
                    }}/>
            </form>
        </>,
        finish: (<>
            <h1 className="text-center text-dark">Password reset</h1>
            <p className="text-center text-dark">Go back to login page</p>
            <div className="text-center">
                <Link to="/login" className="btn btn-success">Back To Login</Link>
            </div>
        </>)
    }

    function resetPassword(event) {
        event.preventDefault();
        if (_newPassword.value !== _confirmPassword.value) {
            _errorMessage.textContent = "Two fields must be identical.";
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