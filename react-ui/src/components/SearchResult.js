import StudentTable from "./StudentTable";
import { Link } from "react-router-dom";
import SearchField from "./SearchField";
import { useState, useEffect } from "react";

export default function SearchResult(props) {
    const [data, setData] = useState(null);
    const [connected, setConnected] = useState(true);

    useEffect(()=>{
        document.title = "Search Result";
        //search students service
    });

    return (
        <div id="students-list-body">
            <h1>SearchResult</h1>
            <SearchField/>
            <StudentTable data={data} connected={connected}/>
            <Link to="/create" className="btn btn-primary">Create Student</Link>
        </div>
    )
}