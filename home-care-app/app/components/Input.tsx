import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-2 mb-4">
            {label && (
                <label className="text-sm font-medium text-secondary">
                    {label}
                </label>
            )}
            <input
                className={`
                    w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200
                    text-primary placeholder:text-gray-400
                    focus:ring-2 focus:ring-primary/10 focus:border-primary
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${error ? 'border-error focus:ring-error/10' : 'border-border'}
                    ${className}
                `}
                {...props}
            />
            {error && (
                <span className="text-xs text-error">
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
