import { Link, useNavigate } from "react-router-dom";

export default function StudentDashboard() {
    const navigate = useNavigate();
    function logout(event) {
        window.localStorage.removeItem(process.env.REACT_APP_STUDENT_TOKEN)
        navigate('/login')
    }
    return (<div>
        <h1>Welcome to student dashboard.</h1>
        <button onClick={logout} className="btn btn-danger">Log Out</button>
    </div>)
}