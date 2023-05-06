import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import StaffService from "../../services/staffService"

export default function CreateStaff()
{
    const [errors, setErrors] = useState("");
    const [connectionErrorMessage, setConnectionErrorMessage] = useState("");
    const {id} = useParams();
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

        StaffService.updateStaff(id, requestData).then(res=>{
            if (res.success)
            {
                navigate("/staff");
            }
            else {
                console.log(res);
                if (res.validation_errors.length > 0) {
                    const valErrors = res.validation_errors.map((value, index)=><li key={index}>{value.message}</li>);
                    setErrors(valErrors);
                }
            }
        }).catch(()=>{
            navigate('/error');
        });
    }

    useEffect(()=>{
        document.title = "Create Staff";
        StaffService.getStaffById(id).then(res=>{
            if (res.success){
                _firstName.value = res.data.first_name;
                _lastName.value = res.data.last_name;
                _email.value = res.data.email;
                _username.value = res.data.username;
            }
        }).catch(()=>{
            setConnectionErrorMessage(<p>Connection fault: Try again later.</p>)
        });
    })

    return(
        <div id="create-staff-body">
            <h1>Edit Staff</h1>
            {connectionErrorMessage}
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
                <input type="submit" value="Save" className="btn btn-primary"/>
                <Link to="/staff" className="btn btn-primary">Cancel</Link>
            </form>
        </div>
    );
}