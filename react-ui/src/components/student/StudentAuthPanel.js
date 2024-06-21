import { useState, useEffect } from "react";
import StudentService from '../../services/studentService'
import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router";
import { socket } from "../../socket";

export default function StudentAuthPanel(props) {
    const [switchComponent, setSwitchComponent] = useState("")
    const [coach, setCoach] = useState("");
    const [updated, setUpdated] = useState(false);
    const [coachCall, setCoachCall] = useState(false);
    const [callCoachText, setCallCoachText] = useState("Call Coach");
    const [callCoachColor, setCallCoachColor] = useState("success");

    const navigate = useNavigate();
    
    const logout = () => {
        window.localStorage.removeItem(process.env.REACT_APP_STUDENT_TOKEN);
        props.setData(null);
        navigate('/login');
    }

    function callCoach(){
        socket.emit('hand up', {
            student: props.data.username,
            handUp: !coachCall
        });
        setCoachCall(!coachCall);
        if (coachCall) {
            setCallCoachText("Call Coach");
            setCallCoachColor("success");
        } else {
            setCallCoachText("Uncall Coach");
            setCallCoachColor("secondary");
        }
    }

    useEffect(()=>{
        socket.connect();
        // return () => {
        //     socket.disconnect();
        // };
    })

    useEffect(()=>{
        return ()=>{
            socket.off('hand up');
        }
    },[])

    useEffect(()=>{
        if (!updated && props.data) {
            StudentService.getStudentByUsername(props.data.username).then(res=>{
                if (res.success) {
                    setSwitchComponent(res.data.username);
                    setCoach(res.data.coach);
                    setCoachCall(res.data.handUp);
                    if (!res.data.handUp) {
                        setCallCoachText("Call Coach");
                        setCallCoachColor("success");
                    } else {
                        setCallCoachText("Uncall Coach");
                        setCallCoachColor("secondary");
                    }
                    setUpdated(true);
                }
            })
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
                <Button variant={callCoachColor} onClick={callCoach}>
                    {callCoachText}
                </Button>
                <Button variant="danger" onClick={logout}>
                    Log Out
                </Button>
            </div>
        </div>
    )
}