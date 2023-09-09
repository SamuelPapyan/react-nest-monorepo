import React, { useState } from 'react'
import AuthService from '../../services/authService';
import { Button } from 'react-bootstrap'
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';

export default function AuthPanel() {
    const [loginShow, setLoginShow] = useState(false);
    const [signUpShow, setSignUpShow] = useState(false);

    const handleLoginShow = () => setLoginShow(true);
    const handleLoginHide = () => setLoginShow(false);
    const handleSignUpShow = () => setSignUpShow(true);
    const handleSignUpHide = () => setSignUpShow(false);

    const [switchComponent, setSwitchComponent] = useState(
    <span>
      <Button variant="primary" onClick={handleSignUpShow}>
        Sign Up
      </Button>
      <Button variant="primary-outline" onClick={handleLoginShow}>
        Log In
      </Button>
    </span>
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
      <LoginModal show={loginShow} hide={handleLoginHide} showSignUp={handleSignUpShow}/>
      <SignUpModal show={signUpShow} hide={handleSignUpHide} showLogin={handleLoginShow}/>
    </>
  );
}