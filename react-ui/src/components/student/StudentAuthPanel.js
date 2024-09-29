import { useState, useEffect } from "react";
import StudentService from '../../services/studentService'
import { Button } from 'react-bootstrap';
import { socket } from "../../socket";
import { useTranslation } from "react-i18next";

export default function StudentAuthPanel(props) {
    const { t } = useTranslation();
    const [switchComponent, setSwitchComponent] = useState("")
    const [coach, setCoach] = useState("");
    const [updated, setUpdated] = useState(false);
    const [coachCall, setCoachCall] = useState(false);
    const [callCoachText, setCallCoachText] = useState(t("textCallCoach"));
    const [callCoachColor, setCallCoachColor] = useState("success");

    
    const logout = () => {
        window.localStorage.removeItem(process.env.REACT_APP_STUDENT_TOKEN);
        props.setData(null);
        window.location.reload();
    }

    function callCoach(){
        socket.emit('hand up', {
            student: props.data.username,
            handUp: !coachCall
        });
        setCoachCall(!coachCall);
        if (coachCall) {
            setCallCoachText(t('textCallCoach'));
            setCallCoachColor("success");
        } else {
            setCallCoachText(t('textUncallCoach'));
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
                        setCallCoachText(t('textCallCoach'));
                        setCallCoachColor("success");
                    } else {
                        setCallCoachText(t('textUncallCoach'));
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
                    <h6 className="text-dark">{t("textCoach")}: {coach}</h6>
                </div>
            <select value={window.localStorage.getItem('react-nest-monorepo-lang')} onChange={props.changeLang}>
                    <option value="en">English</option>
                    <option value="hy">Հայերեն</option>
                </select>
                <Button variant={callCoachColor} onClick={callCoach}>
                    {callCoachText}
                </Button>
                <Button variant="danger" onClick={logout}>
                    {t('textLogout')}
                </Button>
            </div>
        </div>
    )
}