import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import WorkshopsService from '../../../services/workshopsService';
import Multiselect from "multiselect-react-dropdown";

export default function EditWorkshop() {
    const [errors, setErrors] = useState("");
    const [connectionErrorMessage, setConnectionErrorMessage] = useState("");
    const [days, setDays] = useState([]);
    const {id} = useParams();
    const [updated, setUpdated] = useState(false);
    const [students, setStudents] = useState([]);
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
            students: students
        }
        for (let i = 0; i < days.length; i++) {
            requestData.days.push(days[i].value);
        }
        WorkshopsService.updateWorkshop(id, requestData).then(res=>{
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
            console.log(err.message);
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
        console.log(username, index);
        if (index !== -1) {
            arr.splice(index, 1);
            setStudents(arr);
        }
    }

    useEffect(()=>{
        document.title = "Edit Workshop";
        if (!updated) {
        WorkshopsService.getWorkshopById(id).then(res=>{
            if (res.success) {
                if (_title) _title.value = res.data.title;
                if (_description) _description.value = res.data.description;
                if (_startTime) _startTime.value = res.data.start_time;
                if (_endTime) _endTime.value = res.data.end_time;
                setDays(res.data.days.map(x=>{return {'name': x, 'value': x}}));
                setStudents(res.data.students);
            }
        }).catch((err)=>{
            console.log(err);
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
            <h1>Edit Workshop</h1>
            {connectionErrorMessage}
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
                <div>
                    <h2>Registered Students</h2>
                    { students.map((value, index)=>
                        <div key={index} className='d-flex justify-content-between'>
                            <p>{value}</p>
                            <button className='btn btn-danger' onClick={(e)=> {
                                e.preventDefault();
                                removeStudent(value)
                            }}>Unregister</button>
                        </div>
                    ) }
                </div>
                <div
                    className="d-flex justify-content-center"
                    style={{
                        margin: "10px 0 0 0",
                    }}>
                    <input
                        type="submit"
                        value="Save"
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