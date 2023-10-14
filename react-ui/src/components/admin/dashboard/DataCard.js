export default function DataCard(props) {

    return (
    <div className="d-flex justify-content-between p-3 rounded-4" style={{
        width:"250px",
        marginRight: "30px",
        backgroundColor: "#efefef",
    }}>
        <div className="text-start">
            <h2>{props.data.title}</h2>
            <h1>{props.data.count}</h1>
        </div>
        <div>
            <img src="images/user.png" style={{
                width: "60px",
                height: "60px",
                borderRadius: "100%",
                position: "relative",
                top: "-30px",
                left: "30px"
            }}/>
        </div>
    </div>
    )
}