import UserHeader from './UserHeader';
import UserRow from './UserRow';
import {useState, useEffect} from "react";
import { useTranslation } from 'react-i18next';
import {OrbitProgress} from 'react-loading-indicators'

export default function UserTable(props)
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
                data1 = props.data.map((value, index)=> <UserRow userType={props.userType} key={index} data={value}/>);
            else
                data1 = <tr colSpan={7}><td>There is no staff member yet. </td></tr>
            setData(data1);
            if (!props.connected) {
                setData(<tr colSpan={7}><td>Connection failure. Try again later.</td></tr>);
            }
        }
    }, [props.connected, props.data]);

    return (
        <div id="user-table">
            <table className="table table-sm">
                <UserHeader userType={props.userType}/>
                <tbody>
                    {data}
                </tbody>
            </table>
        </div>
    );
}