import { useState, useEffect } from "react";
import StudentService from '../../services/studentService'
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router";

export default function StudentAuthPanel(props) {
    const [switchComponent, setSwitchComponent] = useState(<span></span>)
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
            setUpdated(true);
        }
    })
    return (
        <div className="bg-light d-flex justify-content-end p-2" style={{
            position: "sticky",
            top: "0",
            margin: "0 0 10px 0"
        }}>
            <div>
                <b className="text-dark" style={{marginRight:10}}>{switchComponent}</b>
                <Button variant="danger" onClick={logout}>
                    Log Out
                </Button>
            </div>
        </div>
    )
}