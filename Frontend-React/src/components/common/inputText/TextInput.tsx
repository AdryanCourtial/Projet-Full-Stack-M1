import type React from "react";
import "./TextInput.css";
import type { ChangeEvent } from "react";

interface Props {
  id: string;
  placeholder: string;
  label: string;
  className?: string;
  regex?: RegExp;
  value: string | number;
  password?: boolean;
  type?: "number" | "text" | "datetime-local";
  disabled?: boolean;
  dark?: boolean;
  onChange: (value: string) => void;
}

const TextInput: React.FC<Props> = ({
  id,
  placeholder,
  label,
  className,
  value,
  onChange,
  password,
  type,
  disabled,
  dark = true,
}) => {
  const convertInt = (e: string | number) => {
    if (e === "") return 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      convertInt(value);
    }

    onChange(e.target.value);
  };

  return (
    <label
      htmlFor={id}
      className={`label-input ${dark ? "dark" : "light"} ${className ?? id}`}
    >
      {label}
      <input
        type={password ? "password" : type}
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={handleChange}
        disabled={disabled}
      />
    </label>
  );
};

export default TextInput;
