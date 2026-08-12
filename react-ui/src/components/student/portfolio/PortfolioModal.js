import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

import { useEffect, useState } from 'react'
import { t } from 'i18next';

export const PortfolioModal = (props) => {
    const [updated, setUpdated] = useState(false)
    useEffect(()=>{
        if (!updated) {
            setUpdated(true)
        }
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
                                props.data.workshop.title.am :
                                props.data.workshop.title.en}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={props.data.photo ? props.data.photo : "/images/no_image_landscape.jpeg"} alt="workshop_cover_image" style={{
                        width: "100%"
                    }}/>
                    <h3>{props.data.heading[window.localStorage.getItem("react-nest-monorepo-lang") || 'en']}</h3>
                    <p>{props.data.description[window.localStorage.getItem("react-nest-monorepo-lang") || 'en']}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>{t("textClose")}</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}