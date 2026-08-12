import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet
} from 'react-router-dom';
import ConnectionError from './components/ConnectionError';
import 'bootstrap/dist/css/bootstrap.css'
import './style/App.css';
import Login from './components/admin/auth/Login';
import {useEffect, useState} from 'react';
import StudentLogin from './components/student/StudentLogin'
import AdminBody from './components/admin/AdminBody';
import Dashboard from "./components/admin/dashboard/Dashboard";
import StudentsList from "./components/admin/students/StudentsList";
import CreateStudent from "./components/admin/students/CreateStudent";
import EditStudent from "./components/admin/students/EditStudent";
import UserList from "./components/admin/users/UserList";
import CreateUser from "./components/admin/users/CreateUser";
import EditUser from "./components/admin/users/EditUser";
import ResetPassword from './components/admin/auth/ResetPassword';
import StudentBody from './components/student/StudentBody';
import StudentDashboard from './components/student/Dashboard';
import ResetStudentPassword from './components/student/ResetStudentPassword';
import WorkshopsList from "./components/admin/workshops/WorkshopsList";
import CreateWorkshop from "./components/admin/workshops/CreateWorkshop";
import EditWorkshop from "./components/admin/workshops/EditWorkshop";
import CoachDashboard from './components/admin/coach/CoachDashboard';
import { Portfolio } from './components/student/portfolio/Portfolio'


import { useSelector } from 'react-redux'

import { useTranslation } from 'react-i18next';

let currentLang = "en";

function App() {
  const studentToken = useSelector((state)=>state.auth.studentToken)
  const staffToken = useSelector((state)=>state.auth.staffToken)

  const [updated, setUpdated] = useState(false);

  const { i18n: {changeLanguage, language} } = useTranslation();
  if (window.localStorage.getItem('react-nest-monorepo-lang')) {
    if (language !== window.localStorage.getItem('react-nest-monorepo-lang'))
      changeLanguage(window.localStorage.getItem('react-nest-monorepo-lang'));
  }

  const ProtectedRoute =  ({ user, redirectPath="/admin/login", children }) =>{
    if (!user)
        return <Navigate
          to={redirectPath} replace
          state={{"from": window.location.pathname}} />;
    return children ? children : <Outlet/>
  }

  function handleChangeLanguage(event){
      window.localStorage.setItem('react-nest-monorepo-lang', event.target.value);
      currentLang = event.target.value;
      changeLanguage(window.localStorage.getItem('react-nest-monorepo-lang'));
  }

  return (
    <Router>
      <Routes>
        <Route exact path="/">
          <Route path="login" element={<StudentLogin changeLang={handleChangeLanguage}/>}/>
          <Route path="reset" element={<ResetStudentPassword changeLang={handleChangeLanguage}/>}/>
          <Route element={<ProtectedRoute user={studentToken} redirectPath='/login'/>}>
            <Route element={<StudentBody changeLang={handleChangeLanguage}/>}>
              <Route exact path="" element={<StudentDashboard/>}/>
              <Route path="workshops" element={<WorkshopsList/>}/>
              <Route path="portfolio" element={<Portfolio/>}/>
            </Route>
          </Route>
        </Route>
        <Route path="/admin">
          <Route path="login" element={<Login changeLang={handleChangeLanguage}/>}/>
          <Route path="reset" element={<ResetPassword changeLang={handleChangeLanguage}/>}/>
          <Route element={<ProtectedRoute user={staffToken}/>}>
            <Route element={<AdminBody changeLang={handleChangeLanguage}/>}>
              <Route exact path="" element={<Dashboard/>}/>
              <Route path="coach">
                <Route exact path="" element={<CoachDashboard/>}/>
              </Route>
              <Route path="students">
                <Route exact path="" element={<StudentsList/>}/>
                <Route path="create" element={<CreateStudent />}/>
                <Route path="edit/:id" element={<EditStudent />}/>
              </Route>
              <Route path="staff">
                <Route exact path="" element={<UserList />}/>
                <Route path="create" element={<CreateUser />}/>
                <Route path="edit/:id" element={<EditUser />}/>
              </Route>
              <Route path="workshops">
                <Route exact path="" element={<WorkshopsList/>}/>
                <Route exact path="create" element={<CreateWorkshop/>}/>
                <Route exact path="edit/:id" element={<EditWorkshop/>}/>
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="error" element={<ConnectionError changeLang={handleChangeLanguage}/>}/>
      </Routes>
    </Router>
  );
}

export default App;
