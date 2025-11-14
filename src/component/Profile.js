import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAxiosAPI } from "../hooks/api";
import FormDropdown from "./FormDropdown";

const Profile = () => {
  const { updateProfileAPI, getUserByID } = useAxiosAPI();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
  });

  const roles = [
    { value: "Admin", label: "Admin" },
    { value: "Manager", label: "Manager" },
    { value: "User", label: "User" },
  ];

  const navigate = useNavigate();

  const fetchUserData = async () => {
    console.log("Fetching user data...");
    try {
      const response = await getUserByID();
      console.log("User Data:", response);
      if (response.success) {
        const data = {
          name: response.user.name || "",
          email: response.user.email || "",
          department: response.user.department || "",
          role: response.user.role || "",
        };
        setFormData(data);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch user data.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfileAPI(formData);
      console.log("Update Response:", response);
      if (response.success) {
        toast.success(response.message || "Profile updated successfully!");
        navigate("/availability");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <FormDropdown
          label="Role"
          name="role"
          value={formData.role}
          options={roles}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default Profile;
