import React from 'react';
import { cn } from './Button';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'bg-white rounded-2xl shadow-apple border border-gray-100 overflow-hidden hover:shadow-apple-hover transition-shadow duration-300',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
