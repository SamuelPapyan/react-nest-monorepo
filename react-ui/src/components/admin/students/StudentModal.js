import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useTranslation } from 'react-i18next'

export default function StudentModal(props) {
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
                    (window.localStorage.getItem("react-nest-monorepo-lang") == 'hy' ? props.data.full_name_hy : props.data.full_name_en) :
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
                        <th>{t("labelAge")}</th>
                        <td>{props.data?.age}</td>
                    </tr>
                    <tr>
                        <th>{t("labelLevel")}</th>
                        <td>{props.data?.level}</td>
                    </tr>
                    <tr>
                        <th>{t("labelExperience")}</th>
                        <td>{props.data?.experience}</td>
                    </tr>
                    <tr>
                        <th>{t("labelMaxExperience")}</th>
                        <td>{props.data?.max_experience}</td>
                    </tr>
                    <tr>
                        <th>{t("labelCountry")}</th>
                        <td>{props.data?.country}</td>
                    </tr>
                    <tr>
                        <th>{t("textCoach")}</th>
                        <td>{props.data?.coach}</td>
                    </tr>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>props.onHide()}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}