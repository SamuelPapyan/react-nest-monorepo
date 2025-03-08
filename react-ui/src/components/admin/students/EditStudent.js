import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import StudentService from "../../../services/studentService";
import UserService from "../../../services/userService";
import Form from 'react-bootstrap/Form';
import { useTranslation } from "react-i18next";
import { Cloudinary } from '@cloudinary/url-gen'
import { auto } from '@cloudinary/url-gen/actions/resize'
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from '@cloudinary/react'

export default function EditStudent(props)
{
    const cld = new Cloudinary({ cloud: {cloudName: 'drwi32qkb'}});
    const {t} = useTranslation();
    const [errors, setErrors] = useState("");
    const [updated, setUpdated] = useState(false);
    const [connectionErrorMessage, setConnectionErrorMessage] = useState("")
    const [avatarUrl, setAvatarUrl] = useState(null);
    const {id} = useParams();
    let _fullName, _fullNameHy, _age, _level, _experience, _maxExperience, _country, _username, _email, _coach, _avatar, _avatar_preview, _form;
    const [coaches, setCoaches] = useState([]);
    const navigate = useNavigate();
    
    function submitForm(event){
        event.preventDefault();
        const formData = new FormData(_form);
        formData.append('coach', _coach.value);
        StudentService.updateStudent(id, formData).then(res=>{
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

    async function photoInputOnChange(e) {
        if (e.target.files[0].type.indexOf("image") < 0) {
            e.preventDefault();
            alert("Only image files.");
            e.target.value = "";
            return;
        }
        const blobUrl = URL.createObjectURL(e.target.files[0]);
        _avatar_preview.src = blobUrl;
    }

    useEffect(()=>{
        document.title = t("textEditStudent");
        if (!updated) {
            StudentService.getStudentById(id).then(res=>{
                if (res.success){
                    if (_fullName) _fullName.value = res.data.full_name_en ;
                    if (_fullNameHy) _fullNameHy.value = res.data.full_name_hy ?? "";
                    if (_age) _age.value = res.data.age;
                    if (_level) _level.value = res.data.level;
                    if (_experience) _experience.value = res.data.experience;
                    if (_maxExperience) _maxExperience.value = res.data.max_experience;
                    if (_country) _country.value = res.data.country;
                    if (_username) _username.value = res.data.username;
                    if (_email) _email.value = res.data.email;
                    if (_coach) _coach.value = res.data.coach;
                    if (res.data.avatar) {
                        setAvatarUrl(res.data.avatar);
                    }
                }
                UserService.getCoaches().then(res1=>{
                    if (res1.success) {
                        res1.data.forEach((value, index)=>{
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
                console.log(err);
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
            <form method="POST" onSubmit={submitForm} ref={a => _form = a}>
                <div className="form-group">
                    <label htmlFor="full-name-en-field">{t("textFullNameEn")}</label><br/>
                    <input className="form-control" id="full-name-en-field" type="text" name="full_name_en" ref={(a) => _fullName = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="full-name-hy-field">{t("textFullNameHy")}</label><br/>
                    <input className="form-control" id="full-name-hy-field" type="text" name="full_name_hy" ref={(a) => _fullNameHy = a}/>
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
                    <input className="form-control" id="password-field" type="password" name="password"/>
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
                    <input className="form-control" id="max-experience-field" type="text" name="max_experience" ref={(a) => _maxExperience = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="country-field">{t("labelCountry")}</label><br/>
                    <input className="form-control" id="country-field" type="text" name="country" ref={(a) => _country = a}/>
                </div>
                <div className="mb-2">
                    <label htmlFor="avatar-photo" className="form-label">{t("labelAvatarPhoto")}</label>
                    <input className="form-control" type="file" id="avatar-photo" onInput={photoInputOnChange} name="avatar"/>
                </div>
                <div className="col-12">
                    
                    <img src={
                        avatarUrl ? avatarUrl : "/images/user.png"
                    } width="100" alt="avatar-file-upload" ref={a => _avatar_preview = a}/>
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