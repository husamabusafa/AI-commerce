interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  required = false
}: InputProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          block w-full px-4 py-3 text-sm rounded-2xl bg-white/60 dark:bg-white/10 text-slate-900 dark:text-gray-100 placeholder-slate-400/70 dark:placeholder-gray-500/70
          backdrop-blur-sm ring-0 outline-none focus:ring-4 transition-all duration-300 transition-spring
          disabled:bg-slate-100/60 dark:disabled:bg-white/5 disabled:text-slate-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed
          ${error 
            ? 'focus:ring-red-500/30' 
            : 'focus:ring-blue-500/25'
          }
        `}
      />
      {error && (
        <p className="text-sm text-red-600 animate-fadeIn">{error}</p>
      )}
    </div>
  );
}