import React, { useEffect, useState } from 'react';
import {
  MDBIcon,
  MDBCollapse,
  MDBRipple,
  MDBListGroup,
  MDBListGroupItem
} from 'mdb-react-ui-kit';
import '../../style/SideBar.css';
import AuthService from '../../services/authService';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap';

export default function SideBar() {
  const {t} = useTranslation();
  const [isCoach, setIsCoach] = useState(false);
  useEffect(()=>{
    AuthService.getProfile().then(res=>{
        if (res.success) {
            if (res.data.roles.includes('coach')) {
                setIsCoach(true);
            }
        }
    }).catch((err)=>{
      console.log(err.message);
    })
  })
  return (
    <div className="main-div" style={
      {
        backgroundColor: "#212529",
        flex: 1,
        margin: "0",
        position: "sticky",
        top: "0",
        height:"100vh",
        zIndex: 20
      }
    }>
      <Dropdown className="d-block d-lg-none">
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          <img src="/images/menu_icon.svg" alt="menu_icon" width="24px" height="24px" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="p-1 bg-dark">
        <MDBRipple rippleTag='span' className='bg-dark'>
              <MDBListGroupItem tag='a' href='/admin' className='elem border-0 rounded rounded' active={(window.location.pathname === '/admin') ? true : false}>
                <MDBIcon fas icon="tachometer-alt me-3" />
                {t("textDashboard")}
              </MDBListGroupItem>
            </MDBRipple>

            <MDBRipple rippleTag='span' className='bg-dark'>
              <MDBListGroupItem tag='a' href='/admin/students' className='elem border-0 rounded' active={(window.location.pathname.indexOf('/admin/students') > -1) ? true : false}>
                <MDBIcon fas icon="chart-area me-3" />
                {t("textStudents")}
              </MDBListGroupItem>
            </MDBRipple>

            <MDBRipple rippleTag='span' className='bg-dark'>
              <MDBListGroupItem tag='a' href='/admin/staff' className='elem border-0 rounded' active={(window.location.pathname.indexOf('/admin/staff') > -1) ? true : false}>
                <MDBIcon fas icon="lock me-3" />
                {t("textStaff")}
              </MDBListGroupItem>
            </MDBRipple>

            <MDBRipple rippleTag='span' className='bg-dark'>
              <MDBListGroupItem tag='a' href='/admin/workshops' className='elem border-0 rounded' active={(window.location.pathname.indexOf('/admin/workshops') > -1) ? true : false}>
                <MDBIcon fas icon="lock me-3" />
                {t("textWorkshops")}
              </MDBListGroupItem>
            </MDBRipple>
            {
              isCoach ? (
                <MDBRipple rippleTag='span' className='bg-dark'>
                  <MDBListGroupItem tag='a' href='/admin/coach' className='elem border-0 rounded' active={(window.location.pathname.indexOf('/admin/coach') > -1) ? true : false}>
                    <MDBIcon fas icon="lock me-3" />
                    {t("textCoachDashboard")}
                  </MDBListGroupItem>
                </MDBRipple>
              ) : ""
            }
        </Dropdown.Menu>
      </Dropdown>
      <MDBCollapse tag="nav" className="d-none d-md-block bg-dark sidebar">
        <div className="position-sticky bg-dark">
          <MDBListGroup className="mx-3 mt-4">
            <MDBRipple rippleTag='span' className='bg-dark'>
              <MDBListGroupItem tag='a' href='/admin' className='elem border-0 rounded rounded' active={(window.location.pathname === '/admin') ? true : false}>
                <MDBIcon fas icon="tachometer-alt me-3" />
                {t("textDashboard")}
              </MDBListGroupItem>
            </MDBRipple>

            <MDBRipple rippleTag='span' className='bg-dark'>
              <MDBListGroupItem tag='a' href='/admin/students' className='elem border-0 rounded' active={(window.location.pathname.indexOf('/admin/students') > -1) ? true : false}>
                <MDBIcon fas icon="chart-area me-3" />
                {t("textStudents")}
              </MDBListGroupItem>
            </MDBRipple>

            <MDBRipple rippleTag='span' className='bg-dark'>
              <MDBListGroupItem tag='a' href='/admin/staff' className='elem border-0 rounded' active={(window.location.pathname.indexOf('/admin/staff') > -1) ? true : false}>
                <MDBIcon fas icon="lock me-3" />
                {t("textStaff")}
              </MDBListGroupItem>
            </MDBRipple>

            <MDBRipple rippleTag='span' className='bg-dark'>
              <MDBListGroupItem tag='a' href='/admin/workshops' className='elem border-0 rounded' active={(window.location.pathname.indexOf('/admin/workshops') > -1) ? true : false}>
                <MDBIcon fas icon="lock me-3" />
                {t("textWorkshops")}
              </MDBListGroupItem>
            </MDBRipple>
            {
              isCoach ? (
                <MDBRipple rippleTag='span' className='bg-dark'>
                  <MDBListGroupItem tag='a' href='/admin/coach' className='elem border-0 rounded' active={(window.location.pathname.indexOf('/admin/coach') > -1) ? true : false}>
                    <MDBIcon fas icon="lock me-3" />
                    {t("textCoachDashboard")}
                  </MDBListGroupItem>
                </MDBRipple>
              ) : ""
            }
          </MDBListGroup>
        </div>
      </MDBCollapse>
    </div>
  );
}