import { useState } from "react"

export default function StudentRow(props) {
    const [hidden, setHidden] = useState(false);

    return (
        <>
            {!hidden ? (<div className='d-flex justify-content-between'>
            <p>{props.value}</p>
            <button className='btn btn-danger' onClick={(e)=> {
                e.preventDefault();
                setHidden(true);
                props.remove(props.value)
            }}>Unregister</button>
        </div>) : ""}
        </>
    )
}