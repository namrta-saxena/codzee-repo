// src/App.tsx
import { useState } from 'react';
import type { Option } from './types';
import { OptionInput } from './components/OptionInput';
import { Wheel } from './components/Wheel';
import confetti from 'canvas-confetti';

const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3', '#33FFF3'];

export function App() {
  const [options, setOptions] = useState<Option[]>([
    { id: '1', text: 'Pizza', color: COLORS[0] },
    { id: '2', text: 'Burgers', color: COLORS[1] },
    { id: '3', text: 'Tacos', color: COLORS[2] },
  ]);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Option | null>(null);

  const handleAddOption = (text: string) => {
    const newOption: Option = {
      id: Date.now().toString(),
      text,
      color: COLORS[options.length % COLORS.length],
    };
    setOptions([...options, newOption]);
    setWinner(null);
  };

  const handleRemoveOption = (id: string) => {
    setOptions(options.filter((opt) => opt.id !== id));
    setWinner(null);
  };

  const handleSpin = () => {
    if (options.length < 2 || isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    // Random extra full rotations (3 to 6 rounds) + random degree slice
    const randomExtraDegrees = Math.floor(Math.random() * 360) + 1440;
    const newRotation = rotation + randomExtraDegrees;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);

      // Calculate winning slice based on final normalized angle
      const normalizedDegree = 360 - (newRotation % 360);
      const sliceAngle = 360 / options.length;
      const winningIndex = Math.floor(normalizedDegree / sliceAngle) % options.length;

      const winningOption = options[winningIndex];
      setWinner(winningOption);

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 4000); // Matches CSS duration
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 gap-8">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Decision Wheel</h1>
        <p className="text-gray-600 mt-1">Leave your choices to fate!</p>
      </header>

      <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-4xl">
        <Wheel options={options} rotation={rotation} winner={winner} />
        <OptionInput
          options={options}
          onAddOption={handleAddOption}
          onRemoveOption={handleRemoveOption}
          onSpin={handleSpin}
          isSpinning={isSpinning}
        />
      </div>
    </div>
  );
}

export default App;