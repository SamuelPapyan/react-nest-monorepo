import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import {useTranslation} from 'react-i18next';

export default function WorkshopUnregistrationModal(props) {
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
                    {t("textCongratulations")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{t("textUnregisteredSuccess")}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>props.onHide()}>{t("textThanks")}</Button>
            </Modal.Footer>
        </Modal>
    )
}