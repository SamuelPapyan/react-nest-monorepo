import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import WorkshopsService from '../../../services/workshopsService';
import Multiselect from "multiselect-react-dropdown";
import StudentRow from './StudentRow';
import {useTranslation} from "react-i18next";

export default function EditWorkshop() {
    const {t} = useTranslation();
    const [errors, setErrors] = useState("");
    const [connectionErrorMessage, setConnectionErrorMessage] = useState("");
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [days, setDays] = useState([]);
    const {id} = useParams();
    const [updated, setUpdated] = useState(false);
    const [students, setStudents] = useState([]);
    let _title, _titleHy, _description, _descriptionHy, _startTime, _endTime, _dateInput, _coverPhotoPreview, _form;
    const navigate = useNavigate();

    async function photoInputOnChange(e) {
        if (e.target.files[0].type.indexOf("image") < 0) {
            e.preventDefault();
            alert("Only image files.");
            e.target.value = "";
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
        students.forEach(elem=>formData.append('students', elem));
        WorkshopsService.updateWorkshop(id, formData).then(res=>{
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
        const index = arr.findIndex(x=>x['name'] === removed['name']);
        if (index !== -1) {
            arr.splice(index, 1);
            setDays(arr);
        }
    }

    function removeStudent(username) {
        const arr = students;
        const index = arr.findIndex(x=>x === username);
        if (index !== -1) {
            arr.splice(index, 1);
            setStudents(arr);
        }
    }

    useEffect(()=>{
        document.title = t("textEditWorkshop");
        if (!updated) {
        WorkshopsService.getWorkshopById(id).then(res=>{
            if (res.success) {
                if (_title) _title.value = res.data.title_en;
                if (_titleHy) _titleHy.value = res.data.title_hy ?? "";
                if (_description) _description.value = res.data.description_en;
                if (_descriptionHy) _descriptionHy.value = res.data.description_hy ?? "";
                if (_startTime) _startTime.value = res.data.start_time;
                if (_endTime) _endTime.value = res.data.end_time;
                setDays(res.data.days.map(x=>{return {'name': x, 'value': x}}));
                setStudents(res.data.students);
                if (res.data.cover_photo)
                    setCoverPhoto(res.data.cover_photo);
            }
        }).catch((err)=>{
            setConnectionErrorMessage(<p>Connection fault: Try again later.</p>)
        }).finally(()=>{
            setUpdated(true);
        })
        }
    })

    return (
        <div id="create-workshop-body" style={{
            width: "90%",
            margin: "auto",
        }}>
            <h1>{t("textEditWorkshop")}</h1>
            {connectionErrorMessage}
            {errors}
            <form method='POST' onSubmit={submitForm} ref={a => _form = a}>
                <div className="form-group">
                    <label htmlFor="title-en-field">{t("labelWorkshopTitleEn")}</label><br/>
                    <input className="form-control" id="title-en-field" type="text" name="title_en" ref={(a) => _title = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="title-hy-field">{t("labelWorkshopTitleHy")}</label><br/>
                    <input className="form-control" id="title-hy-field" type="text" name="title_hy" ref={(a) => _titleHy = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="description-en-field">{t("labelDescriptionEn")}</label><br/>
                    <input className="form-control" id="description-en-field" type="text" name="description_en" ref={(a) => _description = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="description-hy-field">{t("labelDescriptionHy")}</label><br/>
                    <input className="form-control" id="description-hy-field" type="text" name="description_hy" ref={(a) => _descriptionHy = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="start-time-field">{t("labelWorkshopStartTime")}</label><br/>
                    <input className="form-control" id="start-time-field" type="time" name="start_time" ref={(a) => _startTime = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="end-time-field">{t("labelWorkshopEndTime")}</label><br/>
                    <input className="form-control" id="end-time-field" type="time" name="end_time" ref={(a) => _endTime = a}/>
                </div>
                <div className="mb-2">
                    <label htmlFor="avatar-photo" className="form-label">{t("labelAvatarPhoto")}</label>
                    <input className="form-control" type="file" id="avatar-photo" onInput={photoInputOnChange} name="cover_photo"/>
                </div>
                <div className="col-12">
                    
                    <img src={
                        coverPhoto ? coverPhoto : "/images/no_image_landscape.jpeg"
                    } width="100" alt="avatar-file-upload" ref={a => _coverPhotoPreview = a}/>
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
                <div>
                    <h2>{t("textRegisteredStudents")}</h2>
                    { students.map((value, index)=>
                        <StudentRow key={index} remove={removeStudent} value={value}/>
                    ) }
                </div>
                <div
                    className="d-flex justify-content-center"
                    style={{
                        margin: "10px 0 0 0",
                    }}>
                    <input
                        type="submit"
                        value={t("textSave")}
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