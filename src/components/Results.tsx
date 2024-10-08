import React from 'react';

interface ResultsProps {
  results: {
    gradoElectrificacion: string;
    espacios: {
      tipo: string;
      area: number;
      iug: number;
      tug: number;
      potenciaIluminacion: number;
    }[];
    totales: {
      areaTotal: number;
      totalIUG: number;
      totalTUG: number;
      totalPotenciaIluminacion: number;
      circuitosTUG: {
        circuitos: { 
          numero: number; 
          tomas: number;
          potencia: number;
          intensidadCarga: number;
          proteccion: {
            In: number;
            seccionCable: number;
            Iz: number;
          };
        }[];
        potenciaTotal: number;
      };
      circuitosIUG: {
        numero: number;
        bocas: number;
        potencia: number;
        intensidadCarga: number;
        proteccion: {
          In: number;
          seccionCable: number;
          Iz: number;
        };
      }[];
    };
  };
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Resultados</h2>
      <p className="mb-4">
        <span className="font-semibold">Grado de Electrificación:</span> {results.gradoElectrificacion}
      </p>
      <h3 className="text-xl font-semibold mb-2">Detalles por Espacio:</h3>
      {results.espacios.map((espacio, index) => (
        <div key={index} className="mb-4 p-4 bg-gray-100 rounded">
          <h4 className="text-lg font-medium">{espacio.tipo}</h4>
          <p>Área: {espacio.area.toFixed(2)} m²</p>
          <p>Bocas de IUG: {espacio.iug}</p>
          <p>Bocas de TUG: {espacio.tug}</p>
          <p>Potencia de Iluminación: {espacio.potenciaIluminacion.toFixed(2)} VA</p>
        </div>
      ))}
      <h3 className="text-xl font-semibold mt-6 mb-2">Totales:</h3>
      <div className="p-4 bg-blue-100 rounded">
        <p>Área Total: {results.totales.areaTotal.toFixed(2)} m²</p>
        <p>Total Bocas de IUG: {results.totales.totalIUG}</p>
        <p>Total Bocas de TUG: {results.totales.totalTUG}</p>
        <p>Potencia Total de Iluminación: {results.totales.totalPotenciaIluminacion.toFixed(2)} VA</p>
        <h4 className="text-lg font-semibold mt-2">Circuitos IUG:</h4>
        {results.totales.circuitosIUG.map((circuito, index) => (
          <p key={index}>
            Circuito IUG {circuito.numero}: {circuito.bocas} bocas - {circuito.potencia.toFixed(2)} VA - Ib: {circuito.intensidadCarga.toFixed(2)} A - In: {circuito.proteccion.In} A - Cable: {circuito.proteccion.seccionCable} mm² (Iz: {circuito.proteccion.Iz} A)
          </p>
        ))}
        <h4 className="text-lg font-semibold mt-2">Circuitos TUG:</h4>
        {results.totales.circuitosTUG.circuitos.map((circuito, index) => (
          <p key={index}>
            Circuito TUG {circuito.numero}: {circuito.tomas} tomas - {circuito.potencia} VA - Ib: {circuito.intensidadCarga.toFixed(2)} A - In: {circuito.proteccion.In} A - Cable: {circuito.proteccion.seccionCable} mm² (Iz: {circuito.proteccion.Iz} A)
          </p>
        ))}
        <p className="font-semibold mt-2">
          Potencia Total de Tomas: {results.totales.circuitosTUG.potenciaTotal.toFixed(2)} VA
        </p>
      </div>
    </div>
  );
};

export default Results;