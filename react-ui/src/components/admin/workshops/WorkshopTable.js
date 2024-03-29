import WorkshopHeader from './WorkshopHeader';
import WorkshopRow from './WorkshopRow';
import { useState, useEffect } from 'react';

export default function WorkshopTable(props)
{
    const [data, setData] = useState(
        (<tr colSpan={8}><td>Loading...</td></tr>)
    );

    useEffect(()=>{
        if (props.data) {
            let data1;
            if (props.data.length > 0)
                data1 = props.data.map((value, index) => <WorkshopRow userType={props.userType} key={index} data={value}/>);
            else
                data1 = <tr colSpan={7}><td>There is no workshops yet.</td></tr>
            setData(data1);
        }
        if (!props.connected) {
            setData(<tr colSpan={7}><td>Connect failure. Try again later.</td></tr>);
        }
    }, [props.data, props.connected, props.userType]);

    return (
        <div id="workshop=table">
            <table className='table'>
                <WorkshopHeader userType={props.userType}/>
                <tbody>
                    {data}
                </tbody>
            </table>
        </div>
    );
}