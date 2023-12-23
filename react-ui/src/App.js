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
import StudentBody from './components/student/StudentBody';
import StudentDashboard from './components/student/Dashboard';
import StudentService from './services/studentService';
import ResetStudentPassword from './components/student/ResetStudentPassword';
import WorkshopsList from "./components/admin/workshops/WorkshopsList";
import CreateWorkshop from "./components/admin/workshops/CreateWorkshop";
import EditWorkshop from "./components/admin/workshops/EditWorkshop";
import SWorkshopsList from './components/student/workshops/WorkshopsList';

function App() {
  const [token, setToken] = useState(true);
  const [studentToken, setStudentToken] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [updated, setUpdated] = useState(false);
  const ProtectedRoute =  ({ user, redirectPath="/admin/login", children }) =>{
    if (!user)
        return <Navigate
          to={redirectPath} replace
          state={{"from": window.location.pathname}} />;
    return children ? children : <Outlet/>
  }

  useEffect(()=>{
    if (!updated || !studentData) {
      AuthService.getProfile().then(res=>{
        if (!res.success)
          setToken(false);
          StudentService.getProfile().then(res=>{
            if (!res.success) {
              setStudentToken(false);
              setStudentData(null);
            }
            else {
              setStudentData(res.data);
            }
            setUpdated(true);
          }).catch(err=>{
            
          })
        }).catch(err=>{
        })
    }
  });

  return (
    <Router>
      <Routes>
        <Route exact path="/">
          <Route path="login" element={<StudentLogin setData={setStudentData} setToken={setStudentToken}/>}/>
          <Route path="reset" element={<ResetStudentPassword/>}/>
          <Route element={<ProtectedRoute user={studentToken} redirectPath='/login'/>}>
            <Route element={<StudentBody setData={setStudentData} data={studentData}/>}>
              <Route exact path="" element={<StudentDashboard/>}/>
              <Route path="workshops" element={<SWorkshopsList/>}/>
            </Route>
          </Route>
        </Route>
        <Route path="/admin">
          <Route path="login" element={<Login setToken={setToken}/>}/>
          <Route path="reset" element={<ResetPassword/>}/>
          <Route element={<ProtectedRoute user={token}/>}>
            <Route element={<AdminBody/>}>
              <Route exact path="" element={<Dashboard/>}/>
              <Route path="students">
                <Route exact path="" element={<StudentsList/>}/>
                <Route path="create" element={<CreateStudent />}/>
                <Route path="edit/:id" element={<EditStudent />}/>
              </Route>
              <Route path="staff">
                <Route exact path="" element={<StaffList />}/>
                <Route path="create" element={<CreateStaff />}/>
                <Route path="edit/:id" element={<EditStaff />}/>
              </Route>
              <Route path="users">
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
        <Route path="error" element={<ConnectionError />}/>
      </Routes>
    </Router>
  );
}

export default App;
