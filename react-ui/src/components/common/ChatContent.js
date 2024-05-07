export default function ChatContent(props) {
    const styleMap = {}
    let sender;
    if (props.data.to === 'student') {
        if (props.isStaff) {
            styleMap.float = 'left';
            styleMap.backgroundColor = props.styles.primaryColor;
            styleMap.color = 'white';
            styleMap.textAlign = "left";
            sender = "me";
        } else {
            styleMap.float = 'right';
            styleMap.backgroundColor = "#acacac";
            styleMap.color = 'black';
            styleMap.textAlign = "right";
            sender = "Coach " + props.data.from;
        }
    } else {
        if (props.isStaff) {
            styleMap.float = 'right';
            styleMap.backgroundColor = "#acacac";
            styleMap.color = 'black';
            styleMap.textAlign = "right";
            sender = props.data.from;
        } else {
            styleMap.float = 'left';
            styleMap.backgroundColor = props.styles.primaryColor;
            styleMap.color = 'white';
            styleMap.textAlign = "left";
            sender = "me";
        }
    }
    const date = new Date(props.data.timestamp);
    const dateString = date.toLocaleDateString() + " | " + date.getHours() + ":" + date.getMinutes();
    return <>
        <div style={{
            ...styleMap,
            minWidth: '50%',
            maxWidth: '75%',
            padding:'5px',
            borderRadius: '5px'

        }}>
            <span>{props.data.content}</span>
            <h6 style={{fontSize:"12px"}}>{sender} | {dateString}</h6>
        </div>
        <div style={{clear:"both"}}><br/></div>
    </>
}