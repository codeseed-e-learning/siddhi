import React from "react";

const Dropdown = ({ options, name, value, onChange }) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-blue-gray-50 rounded-md"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
