import StudentService from "../../services/studentService";
import StaffService from "../../services/staffService";
import WorkshopsService from "../../services/workshopsService";
import UserService from "../../services/userService";
import {useTranslation} from "react-i18next"

export default function SearchBar(props) {
    const {t} = useTranslation();

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
            console.log(err.message);
        })
    }

    return (
        <div className="search-bar">
            <input type="text" ref={a => _search=a} style={{
                borderRadius: 25,
                border: "1px solid #005CA9",
                paddingLeft:10,
            }}/>
            <button onClick={searchResult} className="btn btn-primary">
                <i className="d-none d-lg-inline">{t("textSearch")}</i>
                <img className="d-inline d-lg-none" src="/images/search_icon.svg" width="24px" height="24px" alt="search_icon"/>
            </button>
        </div>
    )
}