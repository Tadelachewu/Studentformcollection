import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, required, value, error, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-white/80">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input 
        className={`input-style ${error ? 'error' : ''}`}
        value={value ?? ''}
        required={required} 
        {...props} 
      />
      {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, required, value, error, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-white/80">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select 
        className={`input-style appearance-none cursor-pointer ${error ? 'error' : ''}`}
        value={value ?? ''}
        required={required} 
        {...props}
      >
        <option value="" className="bg-background text-white">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-background text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, required, value, error, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-white/80">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <textarea 
        className={`input-style ${error ? 'error' : ''}`}
        value={value ?? ''}
        required={required} 
        rows={4}
        {...props} 
      />
      {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
    </div>
  );
};
