import React from "react";

const FormDropdown = ({
  label,
  name,
  value,
  options,
  onChange,
  required = false,
}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-gray-700 font-medium mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-indigo-100"
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormDropdown;
