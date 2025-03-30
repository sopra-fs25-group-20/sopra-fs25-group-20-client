"use client";

interface InputFieldProps {
    placeholder?: string;
    value: string;
    onChange: (val: string) => void;
    type?: string;
    className?: string;
  }
  
  export const InputField = ({
    placeholder,
    value,
    onChange,
    type = "text",
    className = "",
  }: InputFieldProps) => {
    return (
      <input
        type={type}
        className={`form-control ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
  
