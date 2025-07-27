import { NavLink } from 'react-router-dom';
import { useAuth } from 'src/context/AuthContext';

const SideBar = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <div className='flex h-screen w-16 flex-col bg-black text-white md:w-56 lg:w-64'>
      {/* Logo */}
      <div className='border-b border-gray-700 p-4 text-2xl font-bold'>Admin</div>

      {/* Navigation Links */}
      {isAuthenticated && (
        <nav className='flex-1 space-y-2 px-4 py-4'>
          <NavLink
            to='/dashboard'
            className={({ isActive }) =>
              `flex items-center rounded-lg px-4 py-2 no-underline ${
                isActive ? 'bg-gray-700 text-white' : 'text-gray-400'
              } hover:bg-gray-700`
            }
          >
            Dashboard
          </NavLink>

          {/* Section Title */}
          <h3 className='mt-4 mb-2 px-2 text-sm font-semibold text-gray-400 uppercase'>Apps</h3>

          <NavLink
            to='/users'
            className={({ isActive }) =>
              `flex items-center rounded-lg px-4 py-2 no-underline ${
                isActive ? 'bg-gray-700 text-white' : 'text-gray-400'
              } hover:bg-gray-700`
            }
          >
            Users
          </NavLink>

          <NavLink
            to='/trainers'
            className={({ isActive }) =>
              `flex items-center rounded-lg px-4 py-2 no-underline ${
                isActive ? 'bg-gray-700 text-white' : 'text-gray-400'
              } hover:bg-gray-700`
            }
          >
            Trainers
          </NavLink>

          <NavLink
            to='/corporate-enquiry'
            className={({ isActive }) =>
              `flex items-center rounded-lg px-4 py-2 no-underline ${
                isActive ? 'bg-gray-700 text-white' : 'text-gray-400'
              } hover:bg-gray-700`
            }
          >
            Corporate Enquiry
          </NavLink>

          <NavLink
            to='/neo-enquiry'
            className={({ isActive }) =>
              `flex items-center rounded-lg px-4 py-2 no-underline ${
                isActive ? 'bg-gray-700 text-white' : 'text-gray-400'
              } hover:bg-gray-700`
            }
          >
            Neo Enquiry
          </NavLink>

          <NavLink
            to='/payments'
            className={({ isActive }) =>
              `flex items-center rounded-lg px-4 py-2 no-underline ${
                isActive ? 'bg-gray-700 text-white' : 'text-gray-400'
              } hover:bg-gray-700`
            }
          >
            Payments
          </NavLink>

          <NavLink
            to='/login'
            onClick={logout}
            className={({ isActive }) =>
              `flex items-center rounded-lg px-4 py-2 no-underline ${
                isActive ? 'bg-gray-700 text-white' : 'text-gray-400'
              } hover:bg-gray-700`
            }
          >
            Logout
          </NavLink>
        </nav>
      )}
    </div>
  );
};

export default SideBar;
