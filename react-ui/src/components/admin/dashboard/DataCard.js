import {OrbitProgress} from 'react-loading-indicators'

export default function DataCard(props) {

    return (
    <div className="d-flex justify-content-between p-3 rounded-4" style={{
        width:"250px",
        marginRight: "30px",
        backgroundColor: "#efefef",
    }}>
        <div className="text-start">
            <p style={{fontSize: "20px", fontWeight: "bold"}}>{props.data.title}</p>
            <p style={{fontSize: "2em", fontWeight: "bold"}}>{props.data.count || <>
        <OrbitProgress variant="disc" dense color="#005CA9" size="medium" text="" textColor="" />
    </>}</p>
        </div>
        <div>
            <img className='chat-image' src="images/user.png" style={{
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