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
    let _title, _titleHy, _description, _descriptionHy, _startTime, _endTime, _dateInput;
    const navigate = useNavigate();

    function submitForm(event) {
        event.preventDefault();
        if (_startTime.value >= _endTime.value) {
            alert("Start time must be earlier than end time.")
            return;
        }
        const requestData = {
            title_en: _title.value,
            title_hy: _titleHy.value,
            description_en: _description.value,
            description_hy: _descriptionHy.value,
            start_time: _startTime.value,
            end_time: _endTime.value,
            days: [],
            students: []
        }
        for (let i = 0; i < days.length; i++) {
            requestData.days.push(days[i].value);
        }

        WorkshopsService.addWorkshop(requestData).then(res=>{
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
            <form method='POST' onSubmit={submitForm}>
                <div className="form-group">
                    <label htmlFor="title-en-field">{t("labelWorkshopTitleEn")}</label><br/>
                    <input className="form-control" id="title-en-field" type="text" name="title-en" ref={(a) => _title = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="title-hy-field">{t("labelWorkshopTitleHy")}</label><br/>
                    <input className="form-control" id="title-hy-field" type="text" name="title-hy" ref={(a) => _titleHy = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="description-en-field">{t("labelDescriptionEn")}</label><br/>
                    <input className="form-control" id="description-en-field" type="text" name="description-en" ref={(a) => _description = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="description-hy-field">{t("labelDescriptionHy")}</label><br/>
                    <input className="form-control" id="description-hy-field" type="text" name="description-hy" ref={(a) => _descriptionHy = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="start-time-field">{t("labelWorkshopStartTime")}</label><br/>
                    <input className="form-control" id="start-time-field" type="time" name="start-time" ref={(a) => _startTime = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="end-time-field">{t("labelWorkshopEndTime")}</label><br/>
                    <input className="form-control" id="end-time-field" type="time" name="end-time" ref={(a) => _endTime = a}/>
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