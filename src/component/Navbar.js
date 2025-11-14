import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ onClick }) => {
  const [isLogin, setisLogin] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setisLogin(true);
    }
  }, []);
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 text-indigo-600 font-bold text-xl">
            YourApp
          </div>
          <div className="space-x-6 hidden md:flex">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Home
            </Link>
            {!isLogin ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                className="text-gray-700 hover:text-indigo-600 font-medium"
                onClick={onClick}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
