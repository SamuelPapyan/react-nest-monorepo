import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useTranslation } from 'react-i18next'

export default function UserModal(props) {
    const {t} = useTranslation();
    return (
        <Modal
            {...props}
            size="md"
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
                <div className="row">
                    <img className="col" src={props.data?.avatar ? props.data?.avatar : '/images/user.png'} style={{
                        width: 180
                    }} alt="avatar_photo"/>
                    <table className='table col'>
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
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>props.onHide()}>{t("textClose")}</Button>
            </Modal.Footer>
        </Modal>
    )
}