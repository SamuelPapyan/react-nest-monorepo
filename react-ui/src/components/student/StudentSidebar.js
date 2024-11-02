import React from 'react';
import {
  MDBCollapse,
  MDBRipple,
  MDBListGroup,
  MDBListGroupItem
} from 'mdb-react-ui-kit';
import '../../style/StudentSidebar.css';
import { useTranslation } from 'react-i18next';

export default function StudentSidebar() {
  const {t} = useTranslation();
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
                {t('textDashboard')}
              </MDBListGroupItem>
            </MDBRipple>

            <MDBRipple rippleTag='span' className='bg-light'>
              <MDBListGroupItem tag='a' href='/workshops' className='elem border-0 rounded text-dark' active={(window.location.pathname.indexOf('/workshop') > -1) ? true : false}>
                {t('textWorkshops')}
              </MDBListGroupItem>
            </MDBRipple>
          </MDBListGroup>
        </div>
      </MDBCollapse>
    </div>
  );
}