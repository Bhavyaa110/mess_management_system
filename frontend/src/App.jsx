import './App.css'
import Login from './Login.jsx'
import SignupStudent from './SignupStudent.jsx'
import LandingPage from './landingpage.jsx';
import AdminPage from './AdminPage'; // Make sure the path is correct
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/SignupStudent" element={<SignupStudent />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/AdminPage" element={<AdminPage />} />
      <Route path="/LandingPage" element={<LandingPage />} />
    </Routes>
    </Router>
    
  )
} 

export default App;
