import React from "react";

export default function UserHeader(props) {
    return (
        <thead>
            <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Roles</th>
                {props.userType === "ADMIN" ? 
                <th colSpan={2}>Action</th>
                : ""}
            </tr>
        </thead>
    );
}