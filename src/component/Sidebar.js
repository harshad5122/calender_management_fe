import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white shadow-md flex flex-col">
      <div className="px-6 py-4 text-xl font-bold text-indigo-600 border-b">
        YourApp
      </div>
      <nav className="flex-grow px-4 py-6 space-y-4">
        <Link
          to="/availability"
          className="block px-4 py-2 rounded hover:bg-indigo-100 hover:text-indigo-700"
        >
          Availability
        </Link>
        <Link
          to="profile"
          className="block px-4 py-2 rounded hover:bg-indigo-100 hover:text-indigo-700"
        >
          Profile
        </Link>
        <Link
          to="calender"
          className="block px-4 py-2 rounded hover:bg-indigo-100 hover:text-indigo-700"
        >
          Calender
        </Link>
        <Link
          to="/logout"
          className="block px-4 py-2 rounded hover:bg-red-100 hover:text-red-600"
        >
          Logout
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
