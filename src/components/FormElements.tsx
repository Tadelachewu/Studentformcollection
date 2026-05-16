import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <input className="input-field" {...props} />
    {error && <span className="error-text">{error}</span>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, ...props }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <select className="input-field" {...props}>
      <option value="">Select an option</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} style={{ color: '#000' }}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <span className="error-text">{error}</span>}
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, ...props }) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <textarea className="input-field" rows={4} {...props} />
    {error && <span className="error-text">{error}</span>}
  </div>
);
