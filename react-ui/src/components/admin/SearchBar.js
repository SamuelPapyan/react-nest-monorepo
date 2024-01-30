import StudentService from "../../services/studentService";
import StaffService from "../../services/staffService";
import WorkshopsService from "../../services/workshopsService";
import UserService from "../../services/userService";

export default function SearchBar(props) {

    const searchFunctions = {
        "staff": StaffService.searchStaff,
        "students": StudentService.searchStudents,
        "workshops": WorkshopsService.searchWorkshops,
        "users": UserService.searchUsers,
    }

    let _search;

    function searchResult() {
        const sf = searchFunctions[props.searchFunc];
        const query = _search.value;
        sf(query).then(res=>{
            if (res.success)
                props.cb(res.data);

        }).catch(err=>{

        })
    }

    return (
        <div className="search-bar">
            <input type="text" ref={a => _search=a}/>
            <button onClick={searchResult} className="btn btn-primary">
                <i>Search</i>
            </button>
        </div>
    )
}