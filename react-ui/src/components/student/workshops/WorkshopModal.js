import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import { useEffect, useState } from 'react'
import WorkshopRegistrationModal from './WorkshopRegistrationModal';
import WorkshopUnregistrationModal from './WorkshopUnregistrationModal';
import StudentService from '../../../services/studentService';
import { t } from 'i18next';

export default function WorkshopModal(props) {
    const [registerModal, setRegisterModal] = useState(false);
    const [unregisterModal, setUnregisterModal] = useState(false);

    function registerToWorkshop() {
        StudentService.registerToWorkshop(props.data._id).then(res=>{
            if (res.success) {
                props.onHide();
                setRegisterModal(true);
                props.setUpdated(false);
            }
        }).catch(e=>{
            console.log(e.message);
        });
    }

    function unregisterFromWorkshop() {
        StudentService.unregisterToWorkshop(props.data._id).then(res=>{
            if (res.success) {
                props.onHide();
                setUnregisterModal(true);
                props.setUpdated(false);
            }
        }).catch(e=>{
            console.log(e.message);
        });
    }

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "Septermber", "October", "November", "December"];

    useEffect(()=>{
        console.log(props.data.students)
    })
    return (
        <>
            <Modal
                {...props}
                size="lg"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {window.localStorage.getItem("react-nest-monorepo-lang") == 'hy' ?
                                props.data.title.am :
                                props.data.title.en}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={props.data.coverPhoto ? props.data.coverPhoto : "/images/no_image_landscape.jpeg"} alt="workshop_cover_image" style={{
                        width: "100%"
                    }}/>
                    <p>{window.localStorage.getItem("react-nest-monorepo-lang") == 'hy' ? props.data.description.am : props.data.description.en}</p>
                    <ul>
                    {
                    props.data.days.map((value, index)=>{
                        const date = new Date(Date.parse(value));
                        const str = `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()} | ${props.data.startTime} - ${props.data.endTime}`;
                        return (<li key={index}>{str}</li>)
                    })
                    }
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    {!props.data.students?.some(x => x._id === props.data.studentName) ?
                    <Button onClick={registerToWorkshop}>{t("textRegister")}</Button> :
                    <Button variant='secondary' onClick={unregisterFromWorkshop}>{t("textUnregister")}</Button>}
                </Modal.Footer>
            </Modal>
            <WorkshopRegistrationModal show={registerModal} onHide={() => setRegisterModal(false)}/>
            <WorkshopUnregistrationModal show={unregisterModal} onHide={()=>setUnregisterModal(false)}/>
        </>
    )
}