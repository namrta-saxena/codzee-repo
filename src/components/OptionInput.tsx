// src/components/OptionInput.tsx
import React, { useState } from 'react';
import type { Option } from '../types';

interface OptionInputProps {
    options: Option[];
    onAddOption: (text: string) => void;
    onRemoveOption: (id: string) => void;
    onSpin: () => void;
    isSpinning: boolean;
}

export const OptionInput: React.FC<OptionInputProps> = ({
    options,
    onAddOption,
    onRemoveOption,
    onSpin,
    isSpinning,
}) => {
    const [inputVal, setInputVal] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputVal.trim();
        if (!trimmed) return;

        // Check for case-insensitive duplicates
        const isDuplicate = options.some(
            (opt) => opt.text.toLowerCase() === trimmed.toLowerCase()
        );

        if (isDuplicate) {
            setErrorMsg('This option already exists!');
            return;
        }

        setErrorMsg('');
        onAddOption(trimmed);
        setInputVal('');
    };

    return (
        <div className="flex flex-col gap-4 w-full max-w-md p-4 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800">Your Choices</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-1">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputVal}
                        maxLength={30} // Caps the input length to prevent UI overflow
                        onChange={(e) => {
                            setInputVal(e.target.value);
                            if (errorMsg) setErrorMsg(''); // Clear error on typing
                        }}
                        placeholder="Add an option (max 30 chars)"
                        disabled={isSpinning}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={isSpinning}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        Add
                    </button>
                </div>
                {errorMsg && <span className="text-xs text-red-500 mt-1">{errorMsg}</span>}
            </form>

            <div className="max-h-48 overflow-y-auto flex flex-col gap-2">
                {options.map((opt) => (
                    <div
                        key={opt.id}
                        className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border overflow-hidden"
                    >
                        <div className="flex items-center gap-2 overflow-hidden">
                            <span
                                className="w-4 h-4 rounded-full inline-block shrink-0"
                                style={{ backgroundColor: opt.color }}
                            />
                            <span className="text-gray-700 truncate">{opt.text}</span>
                        </div>
                        <button
                            onClick={() => onRemoveOption(opt.id)}
                            disabled={isSpinning}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold shrink-0 ml-2"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={onSpin}
                disabled={isSpinning || options.length < 2}
                className="w-full mt-2 py-3 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 disabled:opacity-50 transition-all"
            >
                {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
            </button>
        </div>
    );
};