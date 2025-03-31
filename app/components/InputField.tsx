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
        className={`form-control px-3 py-2 rounded-2 ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        style={{
          backgroundColor: "var(--inner-box)",
        }}
      />
    );
  };
  
