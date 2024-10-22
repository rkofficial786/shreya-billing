import React, { useState } from "react";
import { Input, Select, Form } from "antd";

const { TextArea } = Input;

// Base Floating Label Input Component
const FloatingLabelInput = ({
  label,
  required,
  value,
  onChange,
  type = "text",
  error,
  ...props
}:any) => {
  const [isFocused, setIsFocused] = useState(false);
  const isOccupied = isFocused || (value && value.length !== 0);

  return (
    <div className="floating-label-input">
      <div
        className={`floating-label-wrapper ${isOccupied ? "is-occupied" : ""} ${
          error ? "has-error" : ""
        }`}
      >
        <Input
          {...props}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="custom-input"
        />
        <label className={`floating-label ${required ? "required" : ""}`}>
          {label}
        </label>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

// Floating Label TextArea Component
const FloatingLabelTextArea = ({
  label,
  required,
  value,
  onChange,
  error,
  ...props
}:any) => {
  const [isFocused, setIsFocused] = useState(false);
  const isOccupied = isFocused || (value && value.length !== 0);

  return (
    <div className="floating-label-input">
      <div
        className={`floating-label-wrapper ${isOccupied ? "is-occupied" : ""} ${
          error ? "has-error" : ""
        }`}
      >
        <TextArea
          {...props}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="custom-textarea"
        />
        <label className={`floating-label ${required ? "required" : ""}`}>
          {label}
        </label>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

// Floating Label Select Component
const FloatingLabelSelect = ({
  label,
  required,
  value,
  onChange,
  options,
  error,
  ...props
}:any) => {
  const [isFocused, setIsFocused] = useState(false);
  const isOccupied = isFocused || value;

  return (
    <div className="floating-label-input">
      <div
        className={`floating-label-wrapper ${isOccupied ? "is-occupied" : ""} ${
          error ? "has-error" : ""
        }`}
      >
        <Select
          {...props}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="custom-select"
          options={options}
        />
        <label className={`floating-label ${required ? "required" : ""}`}>
          {label}
        </label>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export { FloatingLabelInput, FloatingLabelTextArea, FloatingLabelSelect };
