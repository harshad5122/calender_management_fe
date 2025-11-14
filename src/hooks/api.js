import { useAxios } from "../api/apiSlice";

export const useAxiosAPI = () => {
  const apiInstance = useAxios();
  const signUpAPI = async (data) => {
    try {
      const response = await apiInstance.post("/auth/signup", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logInAPI = async (data) => {
    try {
      const response = await apiInstance.post("/auth/login", data);
      console.log("Login API Response:", response);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const updateProfileAPI = async (data) => {
    try {
      const response = await apiInstance.patch("/auth/update-profile", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getUserByID = async () => {
    try {
      const response = await apiInstance.get("/auth/profile");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await apiInstance.get("/auth/get-all-users");
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const addAvailabilityAPI = async (data) => {
    try {
      const response = await apiInstance.post(
        "/calender/add-availability",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getAvalilabilityByUserAPI = async (year, month) => {
    try {
      const response = await apiInstance.get(
        `/calender/get-availability-by-user`,
        {
          params: { year, month },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const getAvalilabilityByUserIDAPI = async (id, year, month) => {
    try {
      const response = await apiInstance.get(
        `/calender/get-availability-by-userId/${id}`,
        {
          params: { year, month },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const updateAvailabilityAPI = async (slotid, data) => {
    try {
      const response = await apiInstance.patch(
        `/calender/update-availability/${slotid}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const deleteAvailabilityAPI = async (slotid) => {
    try {
      const response = await apiInstance.delete(
        `/calender/delete-availability/${slotid}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const fetchslotByWeekAPI = async (startDate, endDate, userId) => {
    try {
      const response = await apiInstance.get(
        `/calender/get-weekly-availability`,
        {
          params: { userId, startDate, endDate },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    signUpAPI,
    logInAPI,
    updateProfileAPI,
    getUserByID,
    getAllUsers,
    addAvailabilityAPI,
    getAvalilabilityByUserAPI,
    getAvalilabilityByUserIDAPI,
    updateAvailabilityAPI,
    deleteAvailabilityAPI,
    fetchslotByWeekAPI,
  };
};
