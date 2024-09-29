import React, { useState, useEffect } from 'react'
import AuthService from '../../../services/authService';
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function AuthPanel(props) {
    const {t} = useTranslation();
    const [switchComponent, setSwitchComponent] = useState(<span></span>);
    const [updated, setUpdated] = useState(false);
    const navigate = useNavigate();
    const logout = () => {
        window.localStorage.removeItem(process.env.REACT_APP_ADMIN_TOKEN);
        navigate('/admin/login');
    }
    useEffect(()=>{
      if (!updated) {
        if (window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)) {
          AuthService.getProfile().then(res=>{
              if (res.success) {
                  setSwitchComponent(
                    <div>
                      <select value={window.localStorage.getItem('react-nest-monorepo-lang')} onChange={props.changeLang}>
                          <option value="en">English</option>
                          <option value="hy">Հայերեն</option>
                      </select>
                      <b className="text-light" style={{marginRight:10}}>{res.data.username}</b>
                      <Button variant="danger" onClick={logout}>
                          {t("textLogout")}
                      </Button>
                    </div>
                  );
              } else {
                  window.localStorage.removeItem(process.env.REACT_APP_ADMIN_TOKEN);
              }
          })
        }
        setUpdated(true);
      }
    })
  return (
    <div className="bg-dark d-flex justify-content-end p-2" style={{
      position: "sticky",
      top:"0",
      margin: "0 0 10px 0",
      zIndex: "3"
    }}>
      { switchComponent }
    </div>
  );
}