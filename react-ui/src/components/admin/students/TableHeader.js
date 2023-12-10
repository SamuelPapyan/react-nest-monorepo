import React from "react";

export default function TableHeader(props){
    return (
        <thead>
            <tr>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Age</th>
                <th>Level</th>
                <th>Experience</th>
                <th>Max Experience</th>
                <th>Country</th>
                { (props.userType === "ADMIN" || props.userType === "EDITOR") ?
                <th colSpan={2}>Action</th>
                : ""}
            </tr>
        </thead>
    );
}