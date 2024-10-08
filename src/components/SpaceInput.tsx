import React, { useState } from 'react';
import { Space, getSpaceTypes } from '../utils/calculations';

interface SpaceInputProps {
  onAddSpace: (space: Space) => void;
}

const SpaceInput: React.FC<SpaceInputProps> = ({ onAddSpace }) => {
  const [type, setType] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');

  const spaceTypes = getSpaceTypes();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type && length && width) {
      onAddSpace({
        type,
        length: parseFloat(length),
        width: parseFloat(width),
      });
      setType('');
      setLength('');
      setWidth('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Tipo de Espacio
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        >
          <option value="">Seleccione un tipo de espacio</option>
          {spaceTypes.map((spaceType) => (
            <option key={spaceType} value={spaceType}>
              {spaceType}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="length" className="block text-sm font-medium text-gray-700">
          Largo (m)
        </label>
        <input
          type="number"
          id="length"
          value={length}
          onChange={(e) => setLength(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="width" className="block text-sm font-medium text-gray-700">
          Ancho (m)
        </label>
        <input
          type="number"
          id="width"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
      >
        Agregar Espacio
      </button>
    </form>
  );
};

export default SpaceInput;