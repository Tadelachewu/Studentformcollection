import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, required, value, error, ...props }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white/70">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input 
        className={`w-full bg-white/5 border ${error ? 'border-accent' : 'border-white/10'} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20`}
        value={value ?? ''}
        required={required} 
        {...props} 
      />
      {error && <span className="text-xs text-accent mt-1">{error}</span>}
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
      <label className="text-sm font-medium text-white/70">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <select 
        className={`w-full bg-white/5 border ${error ? 'border-accent' : 'border-white/10'} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer`}
        value={value ?? ''}
        required={required} 
        {...props}
      >
        <option value="" className="bg-background">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-background">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-accent mt-1">{error}</span>}
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
      <label className="text-sm font-medium text-white/70">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <textarea 
        className={`w-full bg-white/5 border ${error ? 'border-accent' : 'border-white/10'} rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-white/20`}
        value={value ?? ''}
        required={required} 
        rows={4}
        {...props} 
      />
      {error && <span className="text-xs text-accent mt-1">{error}</span>}
    </div>
  );
};
