import React, { useState } from 'react'
import AuthService from '../../services/authService';
import { Button } from 'react-bootstrap'
import LoginModal from './LoginModal';

export default function AuthPanel() {
    const [loginShow, setLoginShow] = useState(false);
    const handleLoginShow = () => setLoginShow(true);
    const handleLoginHide = () => setLoginShow(false);
    const [switchComponent, setSwitchComponent] = useState(
      <Button variant="primary" onClick={handleLoginShow}>
        Log In
      </Button>
    );

    const logout = () => {
        window.localStorage.removeItem('REACT_NEST_MONOREPO_AUTH_TOKEN');
        window.location.reload();
    }

    if (window.localStorage.getItem('REACT_NEST_MONOREPO_AUTH_TOKEN')) {
      AuthService.getProfile(window.localStorage.getItem('REACT_NEST_MONOREPO_AUTH_TOKEN')).then(res=>{
          if (res.success) {
              setSwitchComponent(
                <>
                  <b style={{marginRight:10}}>{res.data.username}</b>
                  <Button variant="danger" onClick={logout}>
                      Log Out
                  </Button>
                </>
              );
          } else {
              window.localStorage.removeItem('REACT_NEST_MONOREPO_AUTH_TOKEN');
          }
      })
    }

  return (
    <>
      { switchComponent }
      <LoginModal show={loginShow} hide={handleLoginHide}/>
    </>
  );
}