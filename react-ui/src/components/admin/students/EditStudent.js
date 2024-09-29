import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import StudentService from "../../../services/studentService";
import UserService from "../../../services/userService";
import Form from 'react-bootstrap/Form';
import { useTranslation } from "react-i18next";

export default function EditStudent(props)
{
    const {t} = useTranslation();
    const [errors, setErrors] = useState("");
    const [updated, setUpdated] = useState(false);
    const [connectionErrorMessage, setConnectionErrorMessage] = useState("")
    const {id} = useParams();
    let _fullName, _age, _level, _experience, _maxExperience, _country, _username, _password, _email, _coach;
    const [coaches, setCoaches] = useState([]);
    const navigate = useNavigate();
    
    function submitForm(event){
        event.preventDefault();
        const requestData = {
            full_name: _fullName.value,
            age: _age.value,
            level: _level.value,
            experience: _experience.value,
            max_experience: _maxExperience.value,
            country: _country.value,
            username: _username.value,
            password: _password.value,
            email: _email.value,
            coach: _coach.value,
        }
        StudentService.updateStudent(id, requestData).then(res=>{
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
        }).catch((err)=>{
            navigate('/error');
        })
    }

    useEffect(()=>{
        document.title = t("textEditStudent");
        if (!updated) {
            StudentService.getStudentById(id).then(res=>{
                if (res.success){
                    _fullName.value = res.data.full_name;
                    _age.value = res.data.age;
                    _level.value = res.data.level;
                    _experience.value = res.data.experience;
                    _maxExperience.value = res.data.max_experience;
                    _country.value = res.data.country;
                    _username.value = res.data.username;
                    _email.value = res.data.email;
                    _coach.value = res.data.coach;
                }
                UserService.getCoaches().then(res1=>{
                    if (res1.success) {
                        res1.data.forEach((value,index)=>{
                            if (value === res.data.coach)
                                [res1.data[0], res1.data[index]] = [res1.data[index], res1.data[0]]
                        });
                        setCoaches(res1.data.map((val, key)=>{
                            return (<option key={key} value={val}>{val}</option>)
                        }));
                        setUpdated(true);
                    }
                })
            }).catch((err)=>{
                setConnectionErrorMessage(<p>Connection fault: Try again later.</p>)
            })
        }
    });

    return(
        <div id="create-student-body" style={{
            width: "90%",
            margin: "auto",
        }}>
            <h1>{t("textEditStudent")}</h1>
            {connectionErrorMessage}
            {errors}
            <form method="POST" onSubmit={submitForm}>
                <div className="form-group">
                    <label htmlFor="full-name-field">{t("textFullName")}</label><br/>
                    <input className="form-control" id="full-name-field" type="text" name="full-name" ref={(a) => _fullName = a}/>
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
                        margin: "10px 0",
                    }}>
                        <input
                            type="submit"
                            value={t("textSave")}
                            className="btn btn-primary"
                            style={{
                                margin: "0 20px 0 0" 
                            }}/>
                        <Link to="/admin/students" className="btn btn-primary">{t("textCancel")}</Link>
                </div>
            </form>
        </div>
    );
}