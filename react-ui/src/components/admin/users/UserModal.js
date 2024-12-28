import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useTranslation } from 'react-i18next'

export default function UserModal(props) {
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
                    (`${props.data.firstName} ${props.data.lastName}`) :
                    "Full Name"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <table className='table'>
                    <tr>
                        <th>{t("labelUsername")}</th>
                        <td>{props.data?.username}</td>
                    </tr>
                    <tr>
                        <th>{t("labelEmail")}</th>
                        <td>{props.data?.email}</td>
                    </tr>
                    <tr>
                        <th>{t("textRoles")}</th>
                        <td>{props.data?.roles}</td>
                    </tr>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>props.onHide()}>{t("textClose")}</Button>
            </Modal.Footer>
        </Modal>
    )
}