import React, { useEffect, useState } from "react";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, endOfWeek } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast } from "react-toastify";
import { formatTime12Hour } from "../utils/utils";
import { useAxiosAPI } from "../hooks/api";
import ErrorDialog from "./ErrorDialog";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarComponent = (props) => {
  const { year, month } = props || {};
  const [view, setView] = useState(Views.MONTH);
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(() => new Date());
  const [errorList, setErrorList] = useState([]);
  const [editingSlot, setEditingSlot] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);
  const [currentYear, setCurrentYear] = useState(date.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(date.getMonth() + 1);

  const {
    addAvailabilityAPI,
    getAvalilabilityByUserAPI,
    updateAvailabilityAPI,
    deleteAvailabilityAPI,
    fetchslotByWeekAPI,
  } = useAxiosAPI();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    status: "Available",
  });
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const fetchSlots = async (y, m) => {
    console.log("Fetching slots for:", y, m);
    try {
      if (!y || !m) {
        console.warn("Year or month is undefined, skipping fetch");
        return;
      }
      const response = await getAvalilabilityByUserAPI(y, m);
      console.log("Fetched slots:", response);
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
          status: slot.status,
        };
      });
      console.log("mappedEvents:", mappedEvents);
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };
  const handleEditSlot = (slot) => {
    setEditingSlot(slot);
    setFormData({
      fromDate: format(new Date(slot.start), "yyyy-MM-dd"),
      toDate: format(new Date(slot.end), "yyyy-MM-dd"),
      startTime: slot.start.toTimeString().slice(0, 8),
      endTime: slot.end.toTimeString().slice(0, 8),
      status: slot.status,
    });
    setDialogOpen(true);
  };

  useEffect(() => {
    const now = new Date();
    const fetchYear = year || now.getFullYear();
    const fetchMonth = month || now.getMonth() + 1;
    fetchSlots(fetchYear, fetchMonth);
  }, [year, month]);

  const handleSelectSlot = (slotInfo) => {
    const from = format(slotInfo.start, "yyyy-MM-dd");
    const to = format(slotInfo.end - 1, "yyyy-MM-dd");

    setFormData({
      fromDate: from,
      toDate: to,
      startTime: "",
      endTime: "",
      status: "Available",
    });

    setDialogOpen(true);
  };

  const closeErrorDialog = () => {
    setErrorList([]);
    setDialogOpen(false);
    const fetchYear = year || date.getFullYear();
    const fetchMonth = month || date.getMonth() + 1;
    fetchSlots(fetchYear, fetchMonth);
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

  const handleNavigate = (newDate, view) => {
    setDate(newDate);
    setCurrentYear(newDate.getFullYear());
    setCurrentMonth(newDate.getMonth() + 1);
    if (view === Views.WEEK) {
      const weekStart = startOfWeek(newDate);
      const weekEnd = endOfWeek(newDate);
      setDate(weekStart);
      const formattedStart = format(weekStart, "yyyy-MM-dd");
      const formattedEnd = format(weekEnd, "yyyy-MM-dd");
      fetchSlotsByDateRange(formattedStart, formattedEnd);
    } else {
      fetchSlots(newDate.getFullYear(), newDate.getMonth() + 1);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startTime =
      formData.startTime.length === 5
        ? formData.startTime + ":00"
        : formData.startTime;
    const endTime =
      formData.endTime.length === 5
        ? formData.endTime + ":00"
        : formData.endTime;

    const payload = {
      date: `${formData.fromDate} to ${formData.toDate}`,
      startTime: startTime,
      endTime: endTime,
      status: formData.status,
    };

    try {
      let response;
      if (editingSlot) {
        response = await updateAvailabilityAPI(
          editingSlot.id,
          JSON.stringify(payload)
        );
      } else {
        response = await addAvailabilityAPI(JSON.stringify(payload));
      }

      if (
        response?.slots?.slotsError &&
        response?.slots?.slotsError?.length > 0
      ) {
        setErrorList(response.slots.slotsError.map((err) => err.error));
        return;
      }
      if (editingSlot) {
        toast.success(
          response.message || "Availability slot updated successfully!"
        );
      } else {
        toast.success(
          response.message || "Availability slot added successfully!"
        );
      }
      setDialogOpen(false);
      // const now = new Date();
      // fetchSlots(now.getFullYear(), now.getMonth() + 1);
      fetchSlots(date.getFullYear(), date.getMonth() + 1);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to add availability."
      );
    }
  };

  const deleteSlot = async (slotId) => {
    try {
      await deleteAvailabilityAPI(slotId);
      toast.success("Time slot deleted successfully.");
      setDialogOpen(false);
      setEditingSlot(null);
      const now = new Date();
      fetchSlots(currentYear, currentMonth);
    } catch (error) {
      toast.error("Failed to delete time slot.");
    }
  };

  return (
    <div className="p-4" style={{ height: "700px" }}>
      <h2 className="text-xl font-semibold mb-4">Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        view={view}
        date={date}
        onNavigate={handleNavigate}
        onView={setView}
        views={[Views.MONTH, Views.WEEK]}
        selectable
        onSelectEvent={(event) => {
          handleEditSlot(event);
        }}
        onSelectSlot={handleSelectSlot}
      />

      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingSlot
                  ? "Edit Availability Slot"
                  : "Add Availability Slot"}
              </h3>
              {editingSlot && (
                <button
                  type="button"
                  onClick={() => {
                    setSlotToDelete(editingSlot.id);
                    setShowDeleteConfirm(true);
                  }}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Delete availability slot"
                  title="Delete slot"
                >
                  Delete
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full border px-3 py-2 rounded ${
                    editingSlot ? "cursor-not-allowed" : ""
                  }`}
                  disabled={editingSlot !== null}
                  min={getTodayDateString()}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate || ""}
                  onChange={handleInputChange}
                  required
                  className={`w-full border px-3 py-2 rounded ${
                    editingSlot ? "cursor-not-allowed" : ""
                  }`}
                  disabled={editingSlot !== null}
                  min={formData.fromDate || getTodayDateString()}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="Tentative">Tentative</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h4 className="mb-4 font-semibold">Confirm Delete</h4>
            <p className="mb-4">
              Are you sure you want to delete this time slot?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSlotToDelete(null);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteSlot(slotToDelete);
                  setShowDeleteConfirm(false);
                  setSlotToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {errorList && errorList.length > 0 && (
        <ErrorDialog errors={errorList} onClose={closeErrorDialog} />
      )}
    </div>
  );
};

export default CalendarComponent;
