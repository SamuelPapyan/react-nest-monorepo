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
import AuthService from './services/authService';
import StudentLogin from './components/student/StudentLogin'
import AdminBody from './components/admin/AdminBody';
import Dashboard from "./components/admin/dashboard/Dashboard";
import StudentsList from "./components/admin/students/StudentsList";
import CreateStudent from "./components/admin/students/CreateStudent";
import EditStudent from "./components/admin/students/EditStudent";
import StaffList from "./components/admin/staff/StaffList";
import CreateStaff from "./components/admin/staff/CreateStaff";
import EditStaff from './components/admin/staff/EditStaff';
import UserList from "./components/admin/users/UserList";
import CreateUser from "./components/admin/users/CreateUser";
import EditUser from "./components/admin/users/EditUser";
import ResetPassword from './components/admin/auth/ResetPassword';

function App() {
  const [token, setToken] = useState(true);
  const ProtectedRoute =  ({ user, redirectPath="/admin/login", children }) =>{
    if (!user)
        return <Navigate
          to={redirectPath} replace
          state={{"from": window.location.pathname}} />;
    return children ? children : <Outlet/>
  }

  useEffect(()=>{
    AuthService.getProfile(null).then(res=>{
      if (!res.success)
        setToken(false);
      }).catch(err=>{
        // console.log(err.message);
      })
  });

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<StudentLogin/>}/>
        <Route path="/admin">
          <Route path="login" element={<Login setToken={setToken}/>}/>
          <Route path="reset" element={<ResetPassword/>}/>
          <Route element={<ProtectedRoute user={token}/>}>
            <Route element={<AdminBody/>}>
              <Route exact path="" element={<Dashboard/>}/>
              <Route exact path="students" element={<StudentsList/>}/>
              <Route path="students/create" element={<CreateStudent />}/>
              <Route path="students/edit/:id" element={<EditStudent />}/>
              <Route exact path="staff" element={<StaffList />}/>
              <Route path="staff/create" element={<CreateStaff />}/>
              <Route path="staff/edit/:id" element={<EditStaff />}/>
              <Route exact path="users" element={<UserList />}/>
              <Route path="users/create" element={<CreateUser />}/>
              <Route path="users/edit/:id" element={<EditUser />}/>
            </Route>
          </Route>
        </Route>
        <Route path="error" element={<ConnectionError />}/>
      </Routes>
    </Router>
  );
}

export default App;
