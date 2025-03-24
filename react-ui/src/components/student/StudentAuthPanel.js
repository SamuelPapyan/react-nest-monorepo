import { useState, useEffect } from "react";
import StudentService from '../../services/studentService'
import { Button } from 'react-bootstrap';
import { socket } from "../../socket";
import { useTranslation } from "react-i18next";
import Dropdown from 'react-bootstrap/Dropdown';

export default function StudentAuthPanel(props) {
    const { t } = useTranslation();
    const [switchComponent, setSwitchComponent] = useState("")
    const [coach, setCoach] = useState("");
    const [updated, setUpdated] = useState(false);
    const [coachCall, setCoachCall] = useState(false);
    const [callCoachText, setCallCoachText] = useState(t("textCallCoach"));
    const [callCoachColor, setCallCoachColor] = useState("success");
    const [avatar, setAvatar] = useState("images/user.png")

    
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
                    if (props.data.avatar) setAvatar(props.data.avatar);
                    setUpdated(true);
                }
            })
        }
    })

    return (
        <>
            <div className="bg-light p-2" style={{
                position: "sticky",
                top: "0",
                margin: "0 0 10px 0",
            }}>
                <div className="d-lg-flex justify-content-end align-items-center d-none">
                    <select id="locale-select" value={window.localStorage.getItem('react-nest-monorepo-lang') ?? "en"} onChange={props.changeLang}>
                        <option value="en">English</option>
                        <option value="hy">Հայերեն</option>
                    </select>
                    <div className="d-flex justify-content-end algin-items-center">
                        <div className="d-flex flex-column align-items-end" style={{marginRight:10}}>
                            <h5 className="text-dark">{switchComponent}</h5>
                            <h6 className="text-dark">{t("textCoach")}: {coach}</h6>
                        </div>
                        <img src={avatar} style={{
                            width: 50,
                            height: 50
                        }} alt="avatar_photo" className="me-2"/>
                        <Button variant={callCoachColor} onClick={callCoach}>
                            {callCoachText}
                        </Button>
                        <Button variant="danger" onClick={logout}>
                            {t('textLogout')}
                        </Button>
                    </div>
                </div>
                <Dropdown className="d-block d-lg-none">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        <img src={avatar} alt="menu_icon" width="24px" height="24px" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="p-1">
                        <div className="d-flex flex-column align-items-end" style={{marginRight:10}}>
                            <h5 className="text-dark">{switchComponent}</h5>
                            <h6 className="text-dark">{t("textCoach")}: {coach}</h6>
                        </div>
                        <select id="locale-select" value={window.localStorage.getItem('react-nest-monorepo-lang') ?? "en"} onChange={props.changeLang}>
                            <option value="en">English</option>
                            <option value="hy">Հայերեն</option>
                        </select>
                        <br/>
                        <Button variant={callCoachColor} onClick={callCoach}>
                            {callCoachText}
                        </Button>
                        <hr className="divide-line"/>
                        <Button variant="danger" onClick={logout}>
                            {t('textLogout')}
                        </Button>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </>
    )
}