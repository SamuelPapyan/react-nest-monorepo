import React from "react";

export default function TableHeader(){
    return (
        <thead>
            <tr>
                <th>Full Name</th>
                <th>Age</th>
                <th>Level</th>
                <th>Experience</th>
                <th>Max Experience</th>
                <th>Country</th>
                <th colSpan={2}>Action</th>
            </tr>
        </thead>
    );
}