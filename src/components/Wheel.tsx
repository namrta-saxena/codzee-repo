// src/components/Wheel.tsx
import React from 'react';
import type { Option } from '../types';

interface WheelProps {
    options: Option[];
    rotation: number;
    winner: Option | null;
}

export const Wheel: React.FC<WheelProps> = ({ options, rotation, winner }) => {
    if (options.length === 0) {
        return (
            <div className="w-72 h-72 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-center p-4">
                Add at least 2 options to start spinning!
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center relative">
            {/* Pointer */}
            <div className="absolute -top-4 z-10 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-red-600 drop-shadow" />

            {/* Wheel Circle */}
            <div className="relative w-72 h-72 rounded-full overflow-hidden border-4 border-gray-800 shadow-xl">
                <div
                    className="w-full h-full rounded-full transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        backgroundImage: getConicGradient(options), // Changed from `background` to `backgroundImage`
                    }}
                />
            </div>

            {winner && (
                <div className="mt-6 text-center animate-bounce">
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Winner</p>
                    <h3 className="text-2xl font-black text-green-600">{winner.text}</h3>
                </div>
            )}
        </div>
    );
};

// Helper function to generate conic-gradient
function getConicGradient(options: Option[]): string {
    if (options.length === 1) {
        return `conic-gradient(${options[0].color} 0deg 360deg)`;
    }

    const sliceAngle = 360 / options.length;
    const slices = options.map((opt, index) => {
        const start = index * sliceAngle;
        const end = (index + 1) * sliceAngle;
        return `${opt.color} ${start}deg ${end}deg`;
    });

    return `conic-gradient(${slices.join(', ')})`;
}