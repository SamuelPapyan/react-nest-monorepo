import { useEffect, useState } from "react"

export default function StudentList(props) {
    const [rows, setRows] = useState([])

    useEffect(()=>{
        setRows(props.data.map(elem=>{
            return (
                <tr>
                    <td>{elem.full_name}</td>
                    <td>{elem.level}</td>
                    <td>{elem.experience}</td>
                </tr>
            )
        }))
    }, [props.data]);

    return (
        <div>
            <h2>Best Students</h2>
            <table className="table table-bordered border-primary w-75 m-auto">
                <thead>
                    <tr>
                        <th><b>Full Name</b></th>
                        <th><b>Level</b></th>
                        <th><b>Experience</b></th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )
}