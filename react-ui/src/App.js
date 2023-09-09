import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import StudentsList from './components/students/StudentsList';
import CreateStudent from './components/students/CreateStudent';
import EditStudent from './components/students/EditStudent';
import StaffList from './components/staff/StaffList';
import CreateStaff from './components/staff/CreateStaff';
import EditStaff from './components/staff/EditStaff';
import UserList from './components/users/UserList';
import CreateUser from './components/users/CreateUser';
import EditUser from './components/users/EditUser';
import ConnectionError from './components/ConnectionError';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';
import AuthPanel from './components/auth/AuthPanel';

function App() {
  return (
    <div className="App container">
      <AuthPanel/>
      <Router>
        <Routes>
          <Route exact path="/students" element={<StudentsList/>}/>
          <Route path="/students/create" element={<CreateStudent/>}/>
          <Route path="/students/edit/:id" element={<EditStudent/>}/>
          <Route exact path="/staff" element={<StaffList/>}/>
          <Route path="/staff/create" element={<CreateStaff/>}/>
          <Route path="/staff/edit/:id" element={<EditStaff/>}/>
          <Route exact path="/users" element={<UserList/>}/>
          <Route path="/users/create" element={<CreateUser/>}/>
          <Route path="/users/edit/:id" element={<EditUser/>}/>
          <Route path="/error" element={<ConnectionError/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
