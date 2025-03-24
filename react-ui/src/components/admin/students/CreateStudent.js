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
    const [updated, setUpdated] = useState(false);
    const [errors, setErrors] = useState("");
    const [coaches, setCoaches] = useState([]);
    let  _coach, _avatar_preview, _form;
    const navigate = useNavigate();
    
    async function photoInputOnChange(e) {
        if (e.target.files[0].type.indexOf("image") < 0) {
            e.preventDefault();
            alert("Only image files.");
            e.target.value = "";
            _avatar_preview.src = "/images/user.png";
            return;
        }
        const blobUrl = URL.createObjectURL(e.target.files[0]);
        _avatar_preview.src = blobUrl;
    }

    function submitForm(event){
        event.preventDefault();
        const formData = new FormData(_form);
        formData.append('coach', _coach.value);
        StudentService.addStudent(formData).then(res=>{
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
        if (!updated) {
            UserService.getCoaches().then(res=>{
                if (res.success) {
                    setCoaches(res.data.map((val, key)=>{
                        return (<option key={key} value={val}>{val}</option>)
                    }));
                    setUpdated(true);
                }
            })
        }
    });

    return(
        <div id="create-student-body" style={{
            width: "90%",
            margin: "auto",
        }}>
            <h1>{t("textCreateStudent")}</h1>
            {errors}
            <form method="POST" onSubmit={submitForm} ref={a => _form = a}>
                <div className="form-group">
                    <label htmlFor="full-name-en-field">{t("textFullNameEn")}</label><br/>
                    <input className="form-control" id="full-name-en-field" type="text" name="full_name_en"/>
                </div>
                <div className="form-group">
                    <label htmlFor="full-name-hy-field">{t("textFullNameHy")}</label><br/>
                    <input className="form-control" id="full-name-hy-field" type="text" name="full_name_hy"/>
                </div>
                <div className="form-group">
                    <label htmlFor="username-field">{t("labelUsername")}</label><br/>
                    <input className="form-control" id="username-field" type="text" name="username"/>
                </div>
                <div className="form-group">
                    <label htmlFor="email-field">{t("labelEmail")}</label><br/>
                    <input className="form-control" id="email-field" type="text" name="email"/>
                </div>
                <div className="form-group">
                    <label htmlFor="password-field">{t("labelPassword")}</label><br/>
                    <input className="form-control" id="password-field" type="password" name="password"/>
                </div>
                <div className="form-group">
                    <label htmlFor="age-field">{t("labelAge")}</label><br/>
                    <input className="form-control" id="age-field" type="text" name="age"/>
                </div>
                <div className="form-group">
                    <label htmlFor="level-field">{t("labelLevel")}</label><br/>
                    <input className="form-control" id="level-field" type="text" name="level"/>
                </div>
                <div className="form-group">
                    <label htmlFor="experience-field">{t("labelExperience")}</label><br/>
                    <input className="form-control" id="experience-field" type="text" name="experience"/>
                </div>
                <div className="form-group">
                    <label htmlFor="max-experience-field">{t("labelMaxExperience")}</label><br/>
                    <input className="form-control" id="max-experience-field" type="text" name="max_experience"/>
                </div>
                <div className="form-group">
                    <label htmlFor="country-field">{t("labelCountry")}</label><br/>
                    <input className="form-control" id="country-field" type="text" name="country"/>
                </div>
                <div className="mb-2">
                    <label htmlFor="avatar-photo" className="form-label">{t("labelAvatarPhoto")}</label>
                    <input className="form-control" type="file" id="avatar-photo" onInput={photoInputOnChange} name="avatar"/>
                </div>
                <div className="col-12">
                    <img width="200" src="/images/user.png" alt="avatar-file-upload" ref={a => _avatar_preview = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="coach-field">{t("textCoach")}</label><br/>
                    <Form.Select defaultValue="" ref={a=> _coach = a}>
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