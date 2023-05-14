import StaffHeader from './StaffHeader';
import StaffRow from './StaffRow';
import { useState, useEffect } from "react";

export default function StaffTable(props)
{
    const [data, setData] = useState((<tr colSpan={7}><td>Loading...</td></tr>));
    const [hasData, setHasData] = useState(false);

    useEffect(()=>{
        if (props.data && !hasData) {
            let data1;
            if (props.data.length > 0)
                data1 = props.data.map((value, index) => <StaffRow key={index} data={value}/>);
            else
                data1 = <tr colSpan={7}><td>There is no students yet.</td></tr>
            setData(data1);
            setHasData(true);
            if (!props.connected && !hasData)
            {
                setData(<tr colSpan={7}><td>Connection failure. Try again later.</td></tr>);
                setHasData(true);
            }
        }
    });

    return (
        <div id="student-table">
            <table className="table">
                <StaffHeader/>
                <tbody>
                    {data}
                </tbody>
            </table>
        </div>
    );
}