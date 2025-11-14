const formatTime12Hour = (timeString) => {
  const [hourStr, minute] = timeString.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // convert to 12-hour format, with 12 instead of 0
  return `${hour}:${minute} ${ampm}`;
};

export { formatTime12Hour };
