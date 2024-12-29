import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import { useState } from 'react'
import WorkshopRegistrationModal from './WorkshopRegistrationModal';
import WorkshopUnregistrationModal from './WorkshopUnregistrationModal';
import StudentService from '../../../services/studentService';
import { t } from 'i18next';

export default function WorkshopModal(props) {
    const [registerModal, setRegisterModal] = useState(false);
    const [unregisterModal, setUnregisterModal] = useState(false);

    function registerToWorkshop() {
        StudentService.registerToWorkshop(props.data.studentName, props.data._id).then(res=>{
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
        StudentService.unregisterToWorkshop(props.data.studentName, props.data._id).then(res=>{
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

    return (
        <>
            <Modal
                {...props}
                size="lg"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {window.localStorage.getItem("react-nest-monorepo-lang") == 'hy' ?
                                props.data.title_hy :
                                props.data.title_en}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{props.data.description}</p>
                    <ul>
                    {
                    props.data.days.map((value, index)=>{
                        const date = new Date(Date.parse(value));
                        const str = `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()} | ${props.data.start_time} - ${props.data.end_time}`;
                        return (<li key={index}>{str}</li>)
                    })
                    }
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    {!props.data.students.some(x => x === props.data.studentName) ?
                    <Button onClick={registerToWorkshop}>{t("textRegister")}</Button> :
                    <Button variant='secondary' onClick={unregisterFromWorkshop}>{t("textUnregister")}</Button>}
                </Modal.Footer>
            </Modal>
            <WorkshopRegistrationModal show={registerModal} onHide={() => setRegisterModal(false)}/>
            <WorkshopUnregistrationModal show={unregisterModal} onHide={()=>setUnregisterModal(false)}/>
        </>
    )
}