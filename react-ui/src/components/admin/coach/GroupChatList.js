import { useEffect, useState } from "react";
import GroupChatRow from "./GroupChatRow"

export default function GroupChatList(props) {
    const [list, setList] = useState([]);
    const [updated, setUpdated] = useState(false);
    useEffect(()=>{
        if (props.data) {
            const list1 = props.data.map((value, index)=>{
                return <GroupChatRow data={value} key={index} userData={props.userData} zIndex={3 + props.data.length - 1 - index} updateFunction={props.updateFunction} students={props.students}/>
            })
            setList(list1);
        }
    }, [updated, props.data])
    return (
        <div>
            {list}
        </div>
    )
}