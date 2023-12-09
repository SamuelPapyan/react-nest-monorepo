import React from "react";

export default function WorkshopHeader(props) {
    return (
        <thead>
            <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Count of Days</th>
                { (props.userType === "ADMIN" || props.userType === "EDITOR") ?
                <th colSpan={2}>Action</th>
                : ""}
            </tr>
        </thead>
    )
}