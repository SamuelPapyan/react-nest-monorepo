import React from "react";

export default function StaffHeader() {
    return (
        <thead>
            <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Password</th>
                <th colSpan={2}>Action</th>
            </tr>
        </thead>
    );
}