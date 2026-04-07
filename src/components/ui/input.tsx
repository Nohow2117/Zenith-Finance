"use client";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full rounded-xl bg-bg-secondary border border-border
          px-4 py-2.5 text-sm text-text-primary
          placeholder:text-text-secondary/50
          focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20
          transition-all duration-200
          ${error ? "border-danger" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
