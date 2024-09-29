import { useEffect, useState } from "react"
import StudentRow from "./StudentRow";
import { useTranslation } from "react-i18next";

export default function StudentList(props) {
    const {t} = useTranslation();
    const [list, setList] = useState([]);
    const [updated, setUpdated] = useState(false);
    useEffect(()=>{
        if (props.data) {
            const list1 = props.data.map((value, index) => {
                return <StudentRow data={value} key={index} userData={props.userData} zIndex={3 + props.data.length - 1 - index}/>
            });
            setList(list1);
        }
    }, [updated, props.data])
    return (
        <div>
            <h1>{t("textMyStudents")}</h1>
            {list}
        </div>
    )
}