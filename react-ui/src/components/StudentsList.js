import { Link } from "react-router-dom";
import StudentTable from "./StudentTable";
import { useState, useEffect } from "react";
import StudentService from "../services/studentService";

export default function StudentsList(props)
{
    const [data, setData] = useState(null);
    const [conencted, setConnected] = useState(true);
    
    useEffect(()=>{
        document.title = "Students List";
        StudentService.getAllStudents().then(res=>{
            if (res.success){
                setData(res.data);
            }
        }).catch(()=>{
            setConnected(false);
        });
    });

    return (
        <div id="students-list-body">
            <h1>Students List</h1>
            <StudentTable data={data} conencted={conencted}/>
            <Link to="/create" className="btn btn-primary">Create Student</Link>
        </div>
    );
}