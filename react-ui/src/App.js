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
import ConnectionError from './components/ConnectionError';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';

function App() {
  return (
    <div className="App container">
      <Router>
        <Routes>
          <Route exact path="/students" element={<StudentsList/>}/>
          <Route path="/students/create" element={<CreateStudent/>}/>
          <Route path="/students/edit/:id" element={<EditStudent/>}/>
          <Route exact path="/staff" element={<StaffList/>}/>
          <Route path="/staff/create" element={<CreateStaff/>}/>
          <Route path="/staff/edit/:id" element={<EditStaff/>}/>
          <Route path="/error" element={<ConnectionError/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
