import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import StudentsList from './components/StudentsList';
import CreateStudent from './components/CreateStudent';
import EditStudent from './components/EditStudent';
import ConnectionError from './components/ConnectionError';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';

function App() {
  return (
    <div className="App container">
      <Router>
        <Routes>
          <Route exact path="/" element={<StudentsList/>}/>
          <Route path="/create" element={<CreateStudent/>}/>
          <Route path="/edit/:id" element={<EditStudent/>}/>
          <Route path="/error" element={<ConnectionError/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
