import React from 'react';
import styles from '@/app/page.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, required, value, error, ...props }) => {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <input 
        className={styles.input} 
        value={value ?? ''}
        required={required} 
        {...props} 
      />
      {error && <span className={styles.errorText}>{error}</span>}
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
    <div className={styles.inputGroup}>
      <label className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <select 
        className={styles.input} 
        value={value ?? ''}
        required={required} 
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.errorText}>{error}</span>}
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
    <div className={styles.inputGroup}>
      <label className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <textarea 
        className={styles.input} 
        value={value ?? ''}
        required={required} 
        rows={4}
        {...props} 
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
