import { Link } from "react-router-dom";
import { useAuth } from "src/context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="w-64 bg-black text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Admin</h2>
      <ul className="space-y-3">
        <li>
          <Link to="/dashboard" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <Link to="/users" className="block p-2 hover:bg-gray-700 rounded">Users</Link>
            </li>
            <li>
              <button onClick={logout} className="block p-2 w-full text-left hover:bg-red-700 rounded">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
