"use client";

interface DropdownProps {
  options: string[] | number[];
  value: string | number;
  onChange: (value: string | number) => void;
  disabled?: boolean;
}

export const Dropdown = (
  { options, value, onChange, disabled = false }: DropdownProps,
) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`dropdown ${disabled ? "disabled" : ""}`}
    disabled={disabled}
  >
    {options.map((option) => (
      <option key={option} value={option}>
        {typeof option === "number" ? `${option} sec` : option}
      </option>
    ))}
  </select>
);
