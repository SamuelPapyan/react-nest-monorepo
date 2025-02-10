import TableHeader from "./TableHeader";
import StudentRow from './StudentRow';
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {OrbitProgress} from 'react-loading-indicators'

export default function StudentTable(props)
{
    const {t} = useTranslation();
    const [data, setData] = useState((<tr colSpan={9}><td><>
        <OrbitProgress variant="disc" dense color="#005CA9" size="medium" text="" textColor="" />
        <p>{t("textLoading")}...</p>
        </>
    </td></tr>));

    useEffect(()=>{
        if (props.data) {
            let data1;
            if (props.data.length > 0)
                data1 = props.data.map((value, index) => <StudentRow userType={props.userType} key={index} data={value}/>);
            else
                data1 = <tr colSpan={9}><td>There is no students yet.</td></tr>
            setData(data1);
        }
        if (!props.connected)
        {
            setData(<tr colSpan={9}><td>Connection failure. Try again later.</td></tr>);
        }
    }, [props.connected, props.data]);

    return (
        <div id="student-table">
            <table className="table table-sm">
                <TableHeader userType={props.userType}/>
                <tbody>
                    {data}
                </tbody>
            </table>
        </div>
    );
}