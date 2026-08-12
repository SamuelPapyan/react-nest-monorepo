import react, { useState, useEffect } from 'react'
import { PortfolioModal } from './PortfolioModal'

export const PortfolioItem = ({data}) => {
    const {workshop, photo, date, heading, description} = data;
    const [modalShow, setModalShow] = useState(false);


    return (
        <>
            <div className="col-3">
                <img src={photo ?? null} style={{
                    width: "100%",
                    height: 200,
                    borderRadius: "10px 10px 0 0",
                    border: "none",
                    backgroundColor: "#c1c1c1"
                }}/>
                <div className="row d-flex align-items-center justify-content-between">
                    <div className="col text-start">
                        <h3>{workshop.title["en"]}</h3>
                        <p>{date.toLocaleString()}</p>
                        <p>{heading["en"]}</p>
                        <p>{description["en"]}</p>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-success" onClick={()=>setModalShow(true)}>Open</button>
                    </div>
                </div>
            </div>
            <PortfolioModal
                show={modalShow}
                data={data}
                onHide={() => setModalShow(false)}
            />
        </>
    )
} 