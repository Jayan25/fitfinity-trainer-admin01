import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

import CorporateEnquiry from './components/CorporateEnquiry';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import NeoEnquiry from './components/NeoEnquiry';
// import UnderDevelopment from './components/UnderDevelopment';
import Payments from './components/Payments/Payments';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './components/ResetPassword';
import SignIn from './components/SignIn';
import TrainerProfile from './components/Trainer/TrainerProfile';
import Trainers from './components/Trainer/Trainers';
import Users from './components/Users';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className='flex'>
          <div className='flex-1'>
            <Routes>
              <Route path='/login' element={<SignIn />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route
                path='/reset-password'
                element={
                  <ProtectedRoute>
                    <ResetPassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/'
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/dashboard'
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/users'
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/trainers/'
                element={
                  <ProtectedRoute>
                    <Trainers />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/trainers/:id'
                element={
                  <ProtectedRoute>
                    <TrainerProfile />
                  </ProtectedRoute>
                }
              />

              <Route
                path='/corporate-enquiry'
                element={
                  <ProtectedRoute>
                    <CorporateEnquiry />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/neo-enquiry'
                element={
                  <ProtectedRoute>
                    <NeoEnquiry />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/payments'
                element={
                  <ProtectedRoute>
                    <Payments />
                  </ProtectedRoute>
                }
              />
              <Route path='*' element={<SignIn />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
