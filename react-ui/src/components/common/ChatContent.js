export default function ChatContent(props) {
    const styleMap = {}
    let sender;
    if (props.data.from === props.user) {
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
        sender = (props.data.from === props.data.coach) ? ("Coach " + props.data.from) : props.data.from;
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