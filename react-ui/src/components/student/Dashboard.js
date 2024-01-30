import { useEffect, useState } from "react"
import StudentService from "../../services/studentService";
import { useOutletContext } from "react-router";

export default function StudentDashboard() {
    const [updated, setUpdated] = useState(false);
    const [workshops, setWorkshops] = useState(<span>Loading...</span>)
    const studentData = useOutletContext();
    
    useEffect(()=>{
        if (!updated && studentData)
        StudentService.getRegisteredWorkshops(studentData.username).then(res=>{
            if (res.success) {
                const arr = res.data.map((value, index)=>{
                    return (<h3 className="text-start text-success" key={index}>{value.title}</h3>)
                })
                setWorkshops(arr);
                setUpdated(true);
            }
        })
    })

    return (<div style={{
        margin: "0 30px",
    }}>
        <h1>Welcome to student dashboard.</h1>
        <h2>Registered Workshops</h2>
        {workshops}
    </div>)
}