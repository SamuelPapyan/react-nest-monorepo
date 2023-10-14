import { Link } from "react-router-dom";
import UserTable from './UserTable';
import { useState, useEffect} from "react";
import UserService from "../../../services/userService";

export default function UserList()
{
    const [data, setData] = useState(null);
    const [connected, setConnected] = useState(true);
    const [permitted, setPermitted] = useState(true);

    useEffect(()=>{
        document.title = "User List";
        UserService.getAllUsers().then(res=>{
            if (res.success){
                setData(res.data);
            }
            else {
                setPermitted(false);
            }
        }).catch(()=>{
            setConnected(false);
        })
    });

    return (
        <div id="staff-list-body" style={{
            margin:"0 30px"
        }}>
            <h1>User List</h1>
            <UserTable data={data} connected={connected} permitted={permitted}/>
            <Link to="/admin/users/create" className="btn btn-primary">Create</Link>
        </div>
    )
}