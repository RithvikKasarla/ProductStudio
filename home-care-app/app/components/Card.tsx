import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: boolean;
    hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    padding = true,
    hoverEffect = false
}) => {
    return (
        <div
            className={`
                bg-white rounded-2xl border border-border shadow-sm overflow-hidden
                transition-all duration-300 ease-out
                ${hoverEffect ? 'hover:shadow-md hover:-translate-y-0.5' : ''}
                ${padding ? 'p-8' : ''}
                ${className}
            `}
        >
            {children}
        </div>
    );
};

export default Card;
