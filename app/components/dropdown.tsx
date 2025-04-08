"use client";

interface DropdownProps {
  label: string;
  options: string[] | number[];
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Dropdown = ({
  label,
  options,
  value,
  onChange,
  className = "",
  style = {},
}: DropdownProps) => (
  <div className={`button-row ${className}`} style={style}>
    <label className="half-button">{label}:</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="dropdown"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {typeof option === "number" ? `${option / 60} min` : option}
        </option>
      ))}
    </select>
  </div>
);
