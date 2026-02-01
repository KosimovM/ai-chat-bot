import * as React from 'react';
import { cn } from '@/lib/utils';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: FieldError;
    registration?: UseFormRegisterReturn;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = 'text', label, error, registration, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        error ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300',
                        className
                    )}
                    ref={ref} // For when not using register, though registration usually handles ref
                    {...registration}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-xs text-red-500">{error.message}</p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
