import {Link} from "react-router-dom";
import {useState, useEffect } from "react";
import {useNavigate} from "react-router";
import UserService from "../../../services/userService";
import { useTranslation } from "react-i18next";

export default function CreateUser()
{
    const {t} = useTranslation();
    const [updated, setUpdated] = useState(false);
    const [errors, setErrors] = useState("");
    let _form, _avatar_preview;
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

    function submitForm(event) {
        event.preventDefault();
        const formData = new FormData(_form);
        UserService.addUser(formData).then(res=>{
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
            <form method="POST" onSubmit={submitForm} ref={a => _form = a}>
                <div className="form-group">
                    <label htmlFor="first-name-en-field">{t("labelFirstNameEn")}</label><br/>
                    <input className="form-control" id="first-name-en-field" type="text" name="first_name_en"/>
                </div>
                <div className="form-group">
                    <label htmlFor="first-name-hy-field">{t("labelFirstNameHy")}</label><br/>
                    <input className="form-control" id="first-name-hy-field" type="text" name="first_name_hy"/>
                </div>
                <div className="form-group">
                    <label htmlFor="last-name-en-field">{t("labelLastNameEn")}</label><br/>
                    <input className="form-control" id="last-name-en-field" type="text" name="last_name_en"/>
                </div>
                <div className="form-group">
                    <label htmlFor="last-name-hy-field">{t("labelLastNameHy")}</label><br/>
                    <input className="form-control" id="last-name-hy-field" type="text" name="last_name_hy"/>
                </div>
                <div className="form-group">
                    <label htmlFor="email-field">{t("labelEmail")}</label><br/>
                    <input className="form-control" id="email-field" type="text" name="email"/>
                </div>
                <div className="form-group">
                    <label htmlFor="username-field">{t("labelUsername")}</label><br/>
                    <input className="form-control" id="username-field" type="text" name="username"/>
                </div>
                <div className="form-group">
                    <label htmlFor="password-field">{t("labelPassword")}</label><br/>
                    <input className="form-control" id="password-field" type="password" name="password"/>
                </div>
                <div className="mb-2">
                    <label htmlFor="avatar-photo" className="form-label">{t("labelAvatarPhoto")}</label>
                    <input className="form-control" type="file" id="avatar-photo" onInput={photoInputOnChange} name="avatar"/>
                </div>
                <div className="col-12">
                    <img width="200" src="/images/user.png" alt="avatar-file-upload" ref={a => _avatar_preview = a}/>
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