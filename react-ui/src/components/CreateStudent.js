import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import StudentService from "../services/studentService";

export default function CreateStudent(props)
{
    const [errors, setErrors] = useState("");
    let _fullName, _age, _level, _experience, _maxExperience, _country;
    const navigate = useNavigate();
    
    function submitForm(event){
        event.preventDefault();
        const requestData = {
            full_name: _fullName.value,
            age: +_age.value,
            level: +_level.value,
            experience: +_experience.value,
            max_experience: +_maxExperience.value,
            country: _country.value,
        }
        
        StudentService.addStudent(requestData).then(res=>{
            if (res.success)
            {
                navigate("/");
            }
        }).catch(()=>{
            navigate('/error');
        })
    }

    useEffect(()=>{
        document.title = "Create Student";
    });

    return(
        <div id="create-student-body">
            <h1>Create Student</h1>
            {errors}
            <form method="POST" onSubmit={submitForm}>
                <div className="form-group">
                    <label htmlFor="full-name-field">Full Name</label><br/>
                    <input className="form-control" id="full-name-field" type="text" name="full-name" ref={(a) => _fullName = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="age-field">Age</label><br/>
                    <input className="form-control" id="age-field" type="text" name="age" ref={(a) => _age = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="level-field">Level</label><br/>
                    <input className="form-control" id="level-field" type="text" name="level" ref={(a) => _level = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="experience-field">Experience</label><br/>
                    <input className="form-control" id="experience-field" type="text" name="experience" ref={(a) => _experience = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="max-experience-field">Max Experience</label><br/>
                    <input className="form-control" id="max-experience-field" type="text" name="max-experience" ref={(a) => _maxExperience = a}/>
                </div>
                <div className="form-group">
                    <label htmlFor="country-field">Country</label><br/>
                    <input className="form-control" id="country-field" type="text" name="country" ref={(a) => _country = a}/>
                </div>
                <input type="submit" value="Create" className="btn btn-primary"/>
                <Link to="/" className="btn btn-primary">Cancel</Link>
            </form>
        </div>
    );
}