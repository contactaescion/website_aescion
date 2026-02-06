import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

interface ButtonVariantsProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    className?: string;
}

export function buttonVariants({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className,
}: ButtonVariantsProps) {
    return cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
        {
            'bg-brand-blue text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30': variant === 'primary',
            'bg-brand-orange text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30': variant === 'secondary',
            'border-2 border-brand-blue text-brand-blue hover:bg-brand-blue/5': variant === 'outline',
            'text-brand-gray hover:bg-gray-100 hover:text-brand-blue': variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
            'h-9 px-4 text-sm': size === 'sm',
            'h-11 px-6 text-base': size === 'md',
            'h-14 px-8 text-lg': size === 'lg',
            'w-full': fullWidth,
        },
        className
    );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={buttonVariants({ variant, size, fullWidth, className })}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';
