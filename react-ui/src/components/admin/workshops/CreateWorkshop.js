import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import WorkshopsService from '../../../services/workshopsService';
import Multiselect from "multiselect-react-dropdown";

export default function CreateWorkshop() {
    const [errors, setErrors] = useState("");
    const [days, setDays] = useState([]);
    let _title, _description, _startTime, _endTime, _dateInput;
    const navigate = useNavigate();

    function submitForm(event) {
        event.preventDefault();
        if (_startTime.value >= _endTime.value) {
            alert("Start time must be earlier than end time.")
            return;
        }
        const requestData = {
            title: _title.value,
            description: _description.value,
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
        document.title = "Create Workshop";
    })

    return (
        <div id="create-workshop=body" style={{
            width: "90%",
            margin: "auto",
        }}>
            <h1>Create Workshop</h1>
            {errors}
            <form method='POST' onSubmit={submitForm}>
                <div className="form-group">
                    <label htmlFor="title-field">Title</label><br/>
                    <input className="form-control" id="title-field" type="text" name="title" ref={(a) => _title = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="description-field">Description</label><br/>
                    <input className="form-control" id="description-field" type="text" name="description" ref={(a) => _description = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="start-time-field">Start Time</label><br/>
                    <input className="form-control" id="start-time-field" type="time" name="start-time" ref={(a) => _startTime = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="end-time-field">End Time</label><br/>
                    <input className="form-control" id="end-time-field" type="time" name="end-time" ref={(a) => _endTime = a}/>
                </div>
                <div className="form-group">
                    <label>Days</label>
                    <input className='form-control' id="days-field" type="date" ref={a=> _dateInput = a}/>
                    <button className='btn btn-primary' onClick={appendDay}>Add</button>
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
                        value="Create"
                        className="btn btn-primary"
                        style={{
                            margin: "0 20px 0 0" 
                        }}
                        />
                    <Link to="/admin/workshops" className="btn btn-primary">Cancel</Link>
                </div>
            </form>
        </div>
    )
}