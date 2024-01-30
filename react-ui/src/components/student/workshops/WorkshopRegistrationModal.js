import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

export default function WorkshopRegistrationModal(props) {
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
                    Congratulations
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>You have registrated successfully</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={()=>props.onHide()}>Thank You</Button>
            </Modal.Footer>
        </Modal>
    )
}