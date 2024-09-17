import React, {useEffect} from "react";

export default function ChatContent(props) {
    let body;

    useEffect(()=>{
        if (props.data) {
            body.innerHTML = getMessageBody(props.data.message);
        }
    });

    function getMessageBody(message) {
        let html = ``, sender;
        const date = new Date(props.data.timeSent);
        const dateString = date.toLocaleString();
        if (props.data.user === props.user) {
            sender = "me";
        } else {
            sender = (props.data.user === props.user && props.isStaff) ? ("Coach " + props.data.user) : props.data.user;
        }
        for (let i in message) {
            if (typeof message[i] == "object") {
                html += `<ul>`
                for (let j in message[i]) {
                    html += `<li>${message[i][j]}</li>`
                }
                html += `</ul>`;
            } else {
                html += `<p>${message[i]}</p>`
            }
        }
        html += `<h6 style="font-size:"12px">${sender} | ${dateString}</h6>`
        return html;
    }

    const styleMap = {}
    if (props.data.user === props.user) {
        styleMap.float = 'left';
        styleMap.backgroundColor = props.styles.primaryColor;
        styleMap.color = 'white';
    } else {
        styleMap.float = 'right';
        styleMap.backgroundColor = "#acacac";
        styleMap.color = 'black';
    }
    return <>
        <div style={{
            ...styleMap,
            minWidth: '50%',
            maxWidth: '75%',
            padding:'5px',
            borderRadius: '5px'
        }} ref={(a)=>body=a}></div>
        <div style={{clear:"both"}}><br/></div>
    </>
}