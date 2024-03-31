import { useEffect, useState } from "react"
import StudentRow from "./StudentRow";

export default function StudentList(props) {
    const [list, setList] = useState([]);
    const [updated, setUpdated] = useState(false);
    useEffect(()=>{
        if (props.data) {
            const list1 = props.data.map((value, index) => {
                return <StudentRow data={value} key={index} userData={props.userData}/>
            });
            setList(list1);
        }
    }, [updated, props.data])
    return (
        <div>
            <h1>My Students</h1>
            {list}
        </div>
    )
}