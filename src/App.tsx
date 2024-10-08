import React, { useState } from 'react';
import { Home, Zap } from 'lucide-react';
import SpaceInput from './components/SpaceInput';
import Results from './components/Results';
import { Space, calculateElectricalRequirements } from './utils/calculations';

function App() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [results, setResults] = useState<any>(null);

  const addSpace = (space: Space) => {
    setSpaces([...spaces, space]);
  };

  const calculateResults = () => {
    const calculatedResults = calculateElectricalRequirements(spaces);
    setResults(calculatedResults);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Zap className="mr-2" />
          Calculadora de Requisitos Eléctricos
        </h1>
        <SpaceInput onAddSpace={addSpace} />
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Espacios Ingresados:</h2>
          <ul>
            {spaces.map((space, index) => (
              <li key={index} className="mb-2">
                <span className="font-medium">{space.type}:</span> {space.length}m x {space.width}m
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={calculateResults}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Calcular Requisitos Eléctricos
        </button>
        {results && <Results results={results} />}
      </div>
    </div>
  );
}

export default App;