import UserHeader from './UserHeader';
import UserRow from './UserRow';
import {useState, useEffect} from "react";

export default function UserTable(props)
{
    const [data, setData] = useState(<tr colSpan={7}><td>Loading...</td></tr>);
    const [hasData, setHasData] = useState(false);

    useEffect(()=>{
        if (!props.permitted && !hasData) {
            setData(<tr colSpan={8}><td>You don't have permission to get staffs.</td></tr>);
            setHasData(true);
        }
        else if (props.data && !hasData) {
            let data1;
            if (props.data.length > 0)
                data1 = props.data.map((value, index)=> <UserRow key={index} data={value}/>);
            else
                data1 = <tr colSpan={8}><td>There is no users yet. </td></tr>
            setData(data1);
            setHasData(true);
            if (!props.connected && !hasData) {
                setData(<tr colSpan={8}><td>Connection failure. Try again later.</td></tr>);
                setHasData(true);
            }
        }
    });

    return (
        <div id="user-table">
            <table className="table">
                <UserHeader/>
                <tbody>
                    {data}
                </tbody>
            </table>
        </div>
    );
}