"use client";

interface DropdownProps {
  label: string;
  options: string[] | number[];
  value: string | number;
  onChange: (value: string | number) => void;
}

export const Dropdown = ({ label, options, value, onChange }: DropdownProps) => (
  <div className="setting">
    <label className="half-button">{label}:</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="dropdown">
      {options.map((option) => (
        <option key={option} value={option}>
          {typeof option === "number" ? `${option / 60} min` : option}
        </option>
      ))}
    </select>
  </div>
);
