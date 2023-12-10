import React from 'react';
import {
  MDBIcon,
  MDBCollapse,
  MDBRipple,
  MDBListGroup,
  MDBListGroupItem
} from 'mdb-react-ui-kit';
import './style/SideBar.css';

export default function SideBar() {
  return (
    <div className="main-div" style={
      {
        backgroundColor: "#212529",
        flex: 1,
        margin: "0",
        position: "sticky",
        top: "0",
        height:"715px"
      }
    }>
      <MDBCollapse tag="nav" className="d-lg-block bg-dark sidebar">
        <div className="position-sticky bg-dark">
          <MDBListGroup className="mx-3 mt-4">
            <MDBRipple rippleTag='span' className='bg-dark'>
              <MDBListGroupItem tag='a' href='/admin' className='elem border-0 rounded rounded' active={(window.location.pathname === '/admin') ? true : false}>
                <MDBIcon fas icon="tachometer-alt me-3" />
                Dashboard
              </MDBListGroupItem>
            </MDBRipple>

            <MDBRipple rippleTag='span' className='bg-dark'>
              <MDBListGroupItem tag='a' href='/admin/students' className='elem border-0 rounded' active={(window.location.pathname.indexOf('/admin/students') > -1) ? true : false}>
                <MDBIcon fas icon="chart-area me-3" />
                Students
              </MDBListGroupItem>
            </MDBRipple>

            <MDBRipple rippleTag='span' className='bg-dark'>
              <MDBListGroupItem tag='a' href='/admin/staff' className='elem border-0 rounded' active={(window.location.pathname.indexOf('/admin/staff') > -1) ? true : false}>
                <MDBIcon fas icon="lock me-3" />
                Staff
              </MDBListGroupItem>
            </MDBRipple>

            <MDBRipple rippleTag='span' className='bg-dark'>
              <MDBListGroupItem tag='a' href='/admin/workshops' className='elem border-0 rounded' active={(window.location.pathname.indexOf('/admin/workshops') > -1) ? true : false}>
                <MDBIcon fas icon="lock me-3" />
                Workshops
              </MDBListGroupItem>
            </MDBRipple>
          </MDBListGroup>
        </div>
      </MDBCollapse>
    </div>
  );
}