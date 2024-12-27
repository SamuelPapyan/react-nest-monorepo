import { useEffect, useState } from "react";
import GroupChatRow from "./GroupChatRow"
import { OrbitProgress } from "react-loading-indicators";
import { t } from "i18next";

export default function GroupChatList(props) {
    const [list, setList] = useState(<>
        <OrbitProgress variant="disc" dense color="#005CA9" size="medium" text="" textColor="" />
        <p>{t("textLoading")}...</p>
    </>);
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