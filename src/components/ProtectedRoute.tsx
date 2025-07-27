// ProtectedRoute.tsx (or .jsx)
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SideBar from './SideBar';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner, etc.
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return (
    <div className='flex h-screen w-screen'>
      {/* Sidebar */}
      <div className='h-screen w-64 bg-black text-white'>
        <SideBar />
      </div>

      {/* Main Content */}
      <div className='flex-grow overflow-y-auto p-4'>{children}</div>
    </div>
  );
};

export default ProtectedRoute;
