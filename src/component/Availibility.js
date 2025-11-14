import React, { useState, useEffect } from "react";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAxiosAPI } from "../hooks/api";
import { toast } from "react-toastify";
import { formatTime12Hour } from "../utils/utils";

const locales = { "en-US": require("date-fns/locale/en-US") };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Availibility = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [view, setView] = useState(Views.MONTH);
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(() => new Date());
  const { getAllUsers, getAvalilabilityByUserIDAPI, fetchslotByWeekAPI } =
    useAxiosAPI();

  const fetchAllUsers = async () => {
    try {
      const response = await getAllUsers();
      if (response.success) {
        setUsers(response.users);
        setFilteredUsers(response.users);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const lowerFilter = filter.trim().toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(lowerFilter) ||
        user.email?.toLowerCase().includes(lowerFilter) ||
        user.department?.toLowerCase().includes(lowerFilter) ||
        user.role?.toLowerCase().includes(lowerFilter)
    );
    setFilteredUsers(filtered);
  }, [filter, users]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setCalendarOpen(true);
    fetchSlots(user.id, new Date().getFullYear(), new Date().getMonth() + 1);
  };

  const handleCloseCalendar = () => {
    setCalendarOpen(false);
    setSelectedUser(null);
  };

  const fetchSlotsByDateRange = async (startDate, endDate, userId) => {
    try {
      let response;
      if (userId) {
        response = await fetchslotByWeekAPI(startDate, endDate, userId);
      } else {
        response = await fetchslotByWeekAPI(startDate, endDate);
      }
      const mappedEvents = response.slots.map((slot) => {
        const startDateTime = new Date(`${slot.date}T${slot.startTime}`);
        const endDateTime = new Date(`${slot.date}T${slot.endTime}`);

        return {
          id: slot.id,
          title: `${formatTime12Hour(slot.startTime)} - ${formatTime12Hour(
            slot.endTime
          )}`,
          start: startDateTime,
          end: endDateTime,
        };
      });
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const fetchSlots = async (userId, y, m) => {
    console.log("Fetching slots for:", { userId, y, m });
    try {
      if (!y || !m) {
        console.warn("Year or month is undefined, skipping fetch");
        return;
      }
      const response = await getAvalilabilityByUserIDAPI(
        userId,
        y.toString(),
        m.toString()
      );
      const mappedEvents = response.slots.map((slot) => {
        const startDateTime = new Date(`${slot.date}T${slot.startTime}`);
        const endDateTime = new Date(`${slot.date}T${slot.endTime}`);

        return {
          title: `${formatTime12Hour(slot.startTime)} - ${formatTime12Hour(
            slot.endTime
          )}`,
          start: startDateTime,
          end: endDateTime,
        };
      });
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  const handleNavigate = (newDate, view) => {
    setDate(newDate);
    if (selectedUser) {
      if (view === Views.WEEK) {
        const day = newDate.getDay();
        const startDate = new Date(newDate);
        startDate.setDate(newDate.getDate() - day);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        const formattedStart = format(startDate, "yyyy-MM-dd");
        const formattedEnd = format(endDate, "yyyy-MM-dd");
        fetchSlotsByDateRange(formattedStart, formattedEnd, selectedUser.id);
      } else {
        fetchSlots(
          selectedUser.id,
          newDate.getFullYear(),
          newDate.getMonth() + 1
        );
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="user-filter" className="font-semibold text-gray-700">
          Filter Users:
        </label>
        <input
          id="user-filter"
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search by name, email, department, role"
          className="border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md px-4 py-2 w-72 shadow-sm transition duration-150 ease-in-out"
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-600">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
              >
                Department
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
              >
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers?.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-center text-gray-500 font-medium"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers &&
              filteredUsers?.length > 0 &&
              filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                      title={`Edit availability for ${user.name}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5m-5-5l5-5m-5 5l-5-5"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {calendarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-[90vw] max-w-4xl max-h-[90vh] overflow-auto relative">
            <button
              onClick={handleCloseCalendar}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl leading-none font-bold"
              aria-label="Close calendar modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              Availability Calendar for {selectedUser.name}
            </h2>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              views={[Views.MONTH, Views.WEEK]}
              onView={setView}
              view={view}
              date={date}
              onNavigate={handleNavigate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Availibility;
