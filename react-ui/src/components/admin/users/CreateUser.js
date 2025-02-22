import {Link} from "react-router-dom";
import {useState, useEffect } from "react";
import {useNavigate} from "react-router";
import UserService from "../../../services/userService";
import { useTranslation } from "react-i18next";

export default function CreateUser()
{
    const {t} = useTranslation();
    const [errors, setErrors] = useState("");
    let _firstName, _firstNameHy, _lastName, _lastNameHy, _email, _username, _password;
    const navigate = useNavigate();

    function submitForm(event) {
        event.preventDefault();
        const requestData = {
            first_name_en: _firstName.value,
            first_name_hy: _firstNameHy.value,
            last_name_en: _lastName.value,
            last_name_hy: _lastNameHy.value,
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
        document.title = t("textCreateStaff");
    })

    return(
        <div id="create-user-body" style={{
            width: "90%",
            margin: "auto",
        }}>
            <h1>{t("textCreateStaff")}</h1>
            {errors}
            <form method="POST" onSubmit={submitForm}>
                <div className="form-group">
                    <label htmlFor="first-name-en-field">{t("labelFirstNameEn")}</label><br/>
                    <input className="form-control" id="first-name-en-field" type="text" name="first-name-en" ref={(a) => _firstName = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="first-name-hy-field">{t("labelFirstNameHy")}</label><br/>
                    <input className="form-control" id="first-name-hy-field" type="text" name="first-name-hy" ref={(a) => _firstNameHy = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="last-name-en-field">{t("labelLastNameEn")}</label><br/>
                    <input className="form-control" id="last-name-en-field" type="text" name="last-name-en" ref={(a) => _lastName = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="last-name-hy-field">{t("labelLastNameHy")}</label><br/>
                    <input className="form-control" id="last-name-hy-field" type="text" name="last-name-hy" ref={(a) => _lastNameHy = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="email-field">{t("labelEmail")}</label><br/>
                    <input className="form-control" id="email-field" type="text" name="email" ref={(a) => _email = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="username-field">{t("labelUsername")}</label><br/>
                    <input className="form-control" id="username-field" type="text" name="username" ref={(a) => _username = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password-field">{t("labelPassword")}</label><br/>
                    <input className="form-control" id="password-field" type="password" name="password" ref={(a) => _password = a}/>
                </div>
                <div
                    className="d-flex justify-content-center"
                    style={{
                        margin: "10px 0 0 0",
                    }}>
                    <input
                        type="submit"
                        value={t("textCreate")}
                        className="btn btn-primary"
                        style={{
                            margin: "0 20px 0 0" 
                        }}
                        />
                    <Link to="/admin/users" className="btn btn-primary">{t("textCancel")}</Link>
                </div>
            </form>
        </div>
    );
}