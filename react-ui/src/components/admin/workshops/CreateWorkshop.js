import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import WorkshopsService from '../../../services/workshopsService';
import Multiselect from "multiselect-react-dropdown";
import {useTranslation} from "react-i18next";

export default function CreateWorkshop() {
    const {t} = useTranslation();
    const [errors, setErrors] = useState("");
    const [days, setDays] = useState([]);
    let _dateInput, _coverPhotoPreview, _form, _startTime, _endTime;
    const navigate = useNavigate();

    async function photoInputOnChange(e) {
        if (e.target.files[0].type.indexOf("image") < 0) {
            e.preventDefault();
            alert("Only image files.");
            e.target.value = "";
            _coverPhotoPreview.src = "/images/no_image_landscape.jpeg";
            return;
        }
        const blobUrl = URL.createObjectURL(e.target.files[0]);
        _coverPhotoPreview.src = blobUrl;
    }

    function submitForm(event) {
        event.preventDefault();
        if (_startTime.value >= _endTime.value) {
            alert("Start time must be earlier than end time.")
            return;
        }
        const formData = new FormData(_form);
        for (let i = 0; i < days.length; i++) {
            formData.append('days', days[i].value);
        }

        WorkshopsService.addWorkshop(formData).then(res=>{
            if (res.success)
            {
                navigate("/admin/workshops");
            }
            else {
                if (res.validation_errors.length > 0) {
                    const valErrors = res.validation_errors.map((value, index)=><li key={index}>{value}</li>);
                    setErrors(valErrors);
                }
                else {
                    alert("You don't have permission to create a staff member.");
                }
            }
        }).catch((err)=>{
            navigate('/error');
        });
    }

    function appendDay(event) {
        event.preventDefault();
        setDays([...days, {'name': _dateInput.value, 'value': _dateInput.value}])
    }

    function onRemoveDay(list, removed) {
        const arr = days;
        let index = arr.findIndex(x=>x['name'] === removed['name']);
        if (index !== -1) {
            arr.splice(index, 1);
            setDays(arr);
        }
    }

    useEffect(()=>{
        document.title = t("textCreateWorkshop");
    })

    return (
        <div id="create-workshop=body" style={{
            width: "90%",
            margin: "auto",
        }}>
            <h1>{t("textCreateWorkshop")}</h1>
            {errors}
            <form method='POST' onSubmit={submitForm} ref={a=>_form=a}>
                <div className="form-group">
                    <label htmlFor="title-en-field">{t("labelWorkshopTitleEn")}</label><br/>
                    <input className="form-control" id="title-en-field" type="text" name="title_en"/>
                </div>
                <div className="form-group">
                    <label htmlFor="title-hy-field">{t("labelWorkshopTitleHy")}</label><br/>
                    <input className="form-control" id="title-hy-field" type="text" name="title_hy"/>
                </div>
                <div className="form-group">
                    <label htmlFor="description-en-field">{t("labelDescriptionEn")}</label><br/>
                    <input className="form-control" id="description-en-field" type="text" name="description_en"/>
                </div>
                <div className="form-group">
                    <label htmlFor="description-hy-field">{t("labelDescriptionHy")}</label><br/>
                    <input className="form-control" id="description-hy-field" type="text" name="description_hy"/>
                </div>
                <div className="form-group">
                    <label htmlFor="start-time-field">{t("labelWorkshopStartTime")}</label><br/>
                    <input className="form-control" id="start-time-field" type="time" name="start_time" ref={a=>_startTime=a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="end-time-field">{t("labelWorkshopEndTime")}</label><br/>
                    <input className="form-control" id="end-time-field" type="time" name="end_time" ref={a=>_endTime=a}/>
                </div>
                <div className="mb-2">
                    <label htmlFor="avatar-photo" className="form-label">{t("labelAvatarPhoto")}</label>
                    <input className="form-control" type="file" id="avatar-photo" onInput={photoInputOnChange} name="cover_photo"/>
                </div>
                <div className="col-12">
                    <img width="200" src="/images/user.png" alt="avatar-file-upload" ref={a => _coverPhotoPreview = a}/>
                </div>
                <div className="form-group">
                    <label>{t("labelDays")}</label>
                    <input className='form-control' id="days-field" type="date" ref={a=> _dateInput = a}/>
                    <button className='btn btn-primary' onClick={appendDay}>{t("textAdd")}</button>
                    <Multiselect
                        options={[]}
                        selectedValues={days}
                        displayValue="name"
                        onRemove={onRemoveDay}
                    />
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
                    <Link to="/admin/workshops" className="btn btn-primary">{t("textCancel")}</Link>
                </div>
            </form>
        </div>
    )
}