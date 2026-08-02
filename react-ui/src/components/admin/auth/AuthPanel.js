import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router'; 
import { useTranslation } from 'react-i18next';
import Dropdown from 'react-bootstrap/Dropdown';
import { useDispatch } from 'react-redux';
import { staffLogout } from '../../../store/authSlice'

export default function AuthPanel(props) {
    const dispatch = useDispatch();
    const user = props.user;

    const {t} = useTranslation();
    const [switchComponent, setSwitchComponent] = useState(<span></span>);
    const [dropdownComponent, setDropdownComponent] = useState(<></>)
    const [updated, setUpdated] = useState(false);
    const [avatar, setAvatar] = useState("/images/user.png");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const logout = () => {
        dispatch(staffLogout());
        navigate('/admin/login');
    }

    useEffect(()=>{
        if (user) {
            setUsername(user.username);
            setDropdownComponent(
              <div class="d-flex p-1 flex-column">
                <select className="" id="locale-select" value={window.localStorage.getItem('react-nest-monorepo-lang') ?? "en"} onChange={props.changeLang}>
                    <option value="en">English</option>
                    <option value="hy">Հայերեն</option>
                </select>
                <p className="text-light text-center" style={{marginRight:10}}>{user.username}</p>
                <Button variant="danger" onClick={logout}>
                    {t("textLogout")}
                </Button>
              </div>
            )
            if (user.avatar) setAvatar(user.avatar);
          }
    }, [user])
  return (
    <>
      <div className="bg-dark p-2 " style={{
        position: "sticky",
        top:"0",
        margin: "0 0 10px 0",
        zIndex: "3"
      }}>
        
        <Dropdown className="d-block d-lg-none bg-dark p-1">
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
            <img src={avatar} alt="menu_icon" width="24px" height="24px" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-1 bg-dark" >
              {dropdownComponent}
            </Dropdown.Menu>
        </Dropdown>
        <div className='d-none d-lg-flex justify-content-end align-items-center'> 
          <select id="locale-select" value={window.localStorage.getItem('react-nest-monorepo-lang') ?? "en"} onChange={props.changeLang}>
              <option value="en">English</option>
              <option value="hy">Հայերեն</option>
          </select>
          <b className="text-light" style={{marginRight:10}}>{username}</b>
          <img src={avatar} style={{
                width: 50,
                height: 50
            }} alt="avatar_photo" className="me-2"/>
          <Button variant="danger" onClick={logout}>
              {t("textLogout")}
          </Button>
        </div>
      </div>
    </>
  );
}