import StaffHeader from './StaffHeader';
import StaffRow from './StaffRow';
import { useState, useEffect } from "react";

export default function StaffTable(props)
{
    const [data, setData] = useState((<tr colSpan={6}><td>Loading...</td></tr>));

    useEffect(()=>{
        if (props.data) {
            let data1;
            if (props.data.length > 0)
                data1 = props.data.map((value, index) => <StaffRow userType={props.userType} key={index} data={value}/>);
            else
                data1 = <tr colSpan={6}><td>There is no staff members yet.</td></tr>
            setData(data1);
            if (!props.connected)
            {
                setData(<tr colSpan={6}><td>Connection failure. Try again later.</td></tr>);
            }
        }
    }, [props.connected, props.data]);

    return (
        <div id="student-table">
            <table className="table">
                <StaffHeader userType={props.userType}/>
                <tbody>
                    {data}
                </tbody>
            </table>
        </div>
    );
}