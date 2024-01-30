import React from 'react';
import {
  MDBIcon,
  MDBCollapse,
  MDBRipple,
  MDBListGroup,
  MDBListGroupItem
} from 'mdb-react-ui-kit';
import '../../style/StudentSidebar.css';

export default function StudentSidebar() {
  return (
    <div className="main-div bg-light" style={
      {
        flex: 1,
        margin: "0",
        position: "sticky",
        top: "0",
        height:"715px"
      }
    }>
      <MDBCollapse tag="nav" className="d-lg-block bg-light sidebar">
        <div className="position-sticky bg-light">
          <MDBListGroup className="mx-3 mt-4">
            <MDBRipple rippleTag='span' className='bg-light'>
              <MDBListGroupItem tag='a' href='/' className='elem border-0 rounded rounded text-dark' active={(window.location.pathname === '/') ? true : false}>
                <MDBIcon fas icon="tachometer-alt me-3" />
                Dashboard
              </MDBListGroupItem>
            </MDBRipple>

            <MDBRipple rippleTag='span' className='bg-light'>
              <MDBListGroupItem tag='a' href='/workshops' className='elem border-0 rounded text-dark' active={(window.location.pathname.indexOf('/workshop') > -1) ? true : false}>
                <MDBIcon fas icon="chart-area me-3" />
                Workshops
              </MDBListGroupItem>
            </MDBRipple>
          </MDBListGroup>
        </div>
      </MDBCollapse>
    </div>
  );
}