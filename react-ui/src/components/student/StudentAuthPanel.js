import { useState, useEffect } from "react";
import StudentService from '../../services/studentService'
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router";

export default function StudentAuthPanel(props) {
    const [switchComponent, setSwitchComponent] = useState("")
    const [coach, setCoach] = useState("");
    const [updated, setUpdated] = useState(false);
    const navigate = useNavigate();
    
    const logout = () => {
        window.localStorage.removeItem(process.env.REACT_APP_STUDENT_TOKEN);
        props.setData(null);
        navigate('/login');
    }
    useEffect(()=>{
        if (!updated && props.data) {
            setSwitchComponent(props.data.username);
            setCoach(props.data.coach);
            setUpdated(true);
        }
    })
    return (
        <div className="bg-light d-flex justify-content-end p-2" style={{
            position: "sticky",
            top: "0",
            margin: "0 0 10px 0"
        }}>
            <div className="d-flex justify-content-end algin-items-center">
                <div className="d-flex flex-column align-items-end" style={{marginRight:10}}>
                    <h5 className="text-dark">{switchComponent}</h5>
                    <h6 className="text-dark">Coach: {coach}</h6>
                </div>
                <Button variant="danger" onClick={logout}>
                    Log Out
                </Button>
            </div>
        </div>
    )
}