import {Link} from "react-router-dom";
import {useState, useEffect } from "react";
import {useNavigate} from "react-router";
import UserService from "../../../services/userService";

export default function CreateUser()
{
    const [errors, setErrors] = useState("");
    let _firstName, _lastName, _email, _username, _password;
    const navigate = useNavigate();

    function submitForm(event) {
        event.preventDefault();
        const requestData = {
            first_name: _firstName.value,
            last_name: _lastName.value,
            email: _email.value,
            username: _username.value,
            password: _password.value
        }

        UserService.addUser(requestData).then(res=>{
            if (res.success) {
                navigate('/admin/users');
            }
            else {
                if (res.validation_errors.length > 0) {
                    const valErrors = res.validation_errors.map((value, index)=>{
                        <li key={index}>{value}</li>
                    });
                    setErrors(valErrors);
                }
                else {
                    alert("You don't have permission to create a user.");
                }
            }
        }).catch(()=>{
            navigate('/error');
        });
    }

    useEffect(()=>{
        document.title = "Create Staff";
    })

    return(
        <div id="create-user-body" style={{
            width: "90%",
            margin: "auto",
        }}>
            <h1>Create Staff</h1>
            {errors}
            <form method="POST" onSubmit={submitForm}>
                <div className="form-group">
                    <label htmlFor="first-name-field">First Name</label><br/>
                    <input className="form-control" id="first-name-field" type="text" name="first-name" ref={(a) => _firstName = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="last-name-field">Last Name</label><br/>
                    <input className="form-control" id="last-name-field" type="text" name="last-name" ref={(a) => _lastName = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="email-field">Email</label><br/>
                    <input className="form-control" id="email-field" type="text" name="email" ref={(a) => _email = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="username-field">Username</label><br/>
                    <input className="form-control" id="username-field" type="text" name="username" ref={(a) => _username = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password-field">Password</label><br/>
                    <input className="form-control" id="password-field" type="password" name="password" ref={(a) => _password = a}/>
                </div>
                <div
                    className="d-flex justify-content-center"
                    style={{
                        margin: "10px 0 0 0",
                    }}>
                    <input
                        type="submit"
                        value="Create"
                        className="btn btn-primary"
                        style={{
                            margin: "0 20px 0 0" 
                        }}
                        />
                    <Link to="/admin/users" className="btn btn-primary">Cancel</Link>
                </div>
            </form>
        </div>
    );
}