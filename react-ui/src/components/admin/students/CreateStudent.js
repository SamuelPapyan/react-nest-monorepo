import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import StudentService from "../../../services/studentService";
import UserService from "../../../services/userService";
import Form from 'react-bootstrap/Form';
import {useTranslation} from "react-i18next";

export default function CreateStudent()
{
    const {t} = useTranslation();
    const [errors, setErrors] = useState("");
    const [coaches, setCoaches] = useState([]);
    let _fullName, _fullNameHy, _age, _level, _experience, _maxExperience, _country, _username, _email, _password, _coach;
    const navigate = useNavigate();
    
    function submitForm(event){
        event.preventDefault();
        const requestData = {
            full_name_en: _fullName.value,
            full_name_hy: _fullNameHy.value,
            age: _age.value,
            level: _level.value,
            experience: _experience.value,
            max_experience: _maxExperience.value,
            country: _country.value,
            username: _username.value,
            email: _email.value,
            password: _password.value,
            coach: _coach.value
        }
        
        StudentService.addStudent(requestData).then(res=>{
            if (res.success)
            {
                navigate("/admin/students");
            }
            else {
                if (res.validation_errors.length > 0) {
                    const valErrors = res.validation_errors.map((value, index)=><li key={index}>{value}</li>);
                    setErrors(valErrors);
                }
            }
        }).catch(()=>{
            navigate('/error');
        })
    }

    useEffect(()=>{
        document.title = t("textCreateStudent");
        UserService.getCoaches().then(res=>{
            if (res.success) {
                setCoaches(res.data.map((val, key)=>{
                    return (<option key={key} value={val}>{val}</option>)
                }));
            }
        })
    });

    return(
        <div id="create-student-body" style={{
            width: "90%",
            margin: "auto",
        }}>
            <h1>{t("textCreateStudent")}</h1>
            {errors}
            <form method="POST" onSubmit={submitForm}>
                <div className="form-group">
                    <label htmlFor="full-name-en-field">{t("textFullNameEn")}</label><br/>
                    <input className="form-control" id="full-name-en-field" type="text" name="full-name-en" ref={(a) => _fullName = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="full-name-hy-field">{t("textFullNameHy")}</label><br/>
                    <input className="form-control" id="full-name-hy-field" type="text" name="full-name-hy" ref={(a) => _fullNameHy = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="username-field">{t("labelUsername")}</label><br/>
                    <input className="form-control" id="username-field" type="text" name="username" ref={(a) => _username = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="email-field">{t("labelEmail")}</label><br/>
                    <input className="form-control" id="email-field" type="text" name="email" ref={(a) => _email = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password-field">{t("labelPassword")}</label><br/>
                    <input className="form-control" id="password-field" type="password" name="password" ref={(a) => _password = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="age-field">{t("labelAge")}</label><br/>
                    <input className="form-control" id="age-field" type="text" name="age" ref={(a) => _age = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="level-field">{t("labelLevel")}</label><br/>
                    <input className="form-control" id="level-field" type="text" name="level" ref={(a) => _level = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="experience-field">{t("labelExperience")}</label><br/>
                    <input className="form-control" id="experience-field" type="text" name="experience" ref={(a) => _experience = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="max-experience-field">{t("labelMaxExperience")}</label><br/>
                    <input className="form-control" id="max-experience-field" type="text" name="max-experience" ref={(a) => _maxExperience = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="country-field">{t("labelCountry")}</label><br/>
                    <input className="form-control" id="country-field" type="text" name="country" ref={(a) => _country = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="coach-field">{t("textCoach")}</label><br/>
                    <Form.Select defaultValue="Cakes" ref={a=> _coach = a}>
                        {coaches}
                    </Form.Select>
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
                    <Link to="/admin/students" className="btn btn-primary">{t("textCancel")}</Link>
                </div>
            </form>
        </div>
    );
}