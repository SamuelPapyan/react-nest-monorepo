import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useTranslation } from 'react-i18next'

export default function WorkshopModal(props) {
    const {t} = useTranslation();
    return (
        <Modal
            {...props}
            size="lg"
            centered>
            <Modal.Header
                closeButton
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Modal.Title>
                    {props.data ? 
                    props.data.title :
                    "Full Name"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <table className='table'>
                    <tr>
                        <th>{t("labelDescription")}</th>
                        <td>{props.data?.description}</td>
                    </tr>
                    <tr>
                        <th>{t("labelWorkshopStartTime")}</th>
                        <td>{props.data?.startTime}</td>
                    </tr>
                    <tr>
                        <th>{t("labelWorkshopEndTime")}</th>
                        <td>{props.data?.endTime}</td>
                    </tr>
                    <tr>
                        <th>{t("textCountOfDays")}</th>
                        <td>{props.data?.count}</td>
                    </tr>
                    <tr>
                        <th>{t("textRegisteredStudents")}</th>
                        <td>{props.data?.students}</td>
                    </tr>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>props.onHide()}>{t("textClose")}</Button>
            </Modal.Footer>
        </Modal>
    )
}