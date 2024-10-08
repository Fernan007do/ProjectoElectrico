export interface Space {
  type: string;
  length: number;
  width: number;
}

export function getSpaceTypes(): string[] {
  return [
    "sala",
    "comedor",
    "dormitorio",
    "cocina",
    "baño",
    "vestíbulo",
    "garaje",
    "hall",
    "pasillo",
    "lavadero",
    "balcón",
    "galería",
    "estudio",
    "biblioteca",
    "otros (semicubierto)"
  ];
}

interface ProteccionCable {
  In: number;
  seccionCable: number;
  Iz: number;
}

function seleccionarProteccionYCable(Ib: number): ProteccionCable {
  const proteccionesDisponibles = [5, 10, 16, 20, 32, 63];
  const seccionesCable = [
    { seccion: 1.5, Iz: 13 },
    { seccion: 2.5, Iz: 18 },
    { seccion: 4, Iz: 25 }
  ];

  let In = proteccionesDisponibles.find(p => p > Ib) || 63;
  let seccionCable = seccionesCable.find(s => s.Iz > In) || seccionesCable[seccionesCable.length - 1];

  return {
    In,
    seccionCable: seccionCable.seccion,
    Iz: seccionCable.Iz
  };
}

function calcularCircuitosTUG(totalTUG: number) {
  const circuitos = [];
  let tomasRestantes = totalTUG;
  let numeroCircuito = 1;

  while (tomasRestantes > 0) {
    const tomasEnEsteCircuito = Math.min(tomasRestantes, 15);
    const potencia = 2200; // VA
    const intensidadCarga = potencia / 220; // A
    const proteccion = seleccionarProteccionYCable(intensidadCarga);
    circuitos.push({
      numero: numeroCircuito,
      tomas: tomasEnEsteCircuito,
      potencia,
      intensidadCarga,
      proteccion
    });
    tomasRestantes -= tomasEnEsteCircuito;
    numeroCircuito++;
  }

  const potenciaTotal = circuitos.length * 2200;

  return {
    circuitos,
    potenciaTotal
  };
}

function calcularCircuitosIUG(totalIUG: number, potenciaTotal: number) {
  const maxBocasPorCircuito = 15;
  const circuitos = [];
  let bocasRestantes = totalIUG;
  let numeroCircuito = 1;

  while (bocasRestantes > 0) {
    const bocasEnEsteCircuito = Math.min(bocasRestantes, maxBocasPorCircuito);
    const potenciaCircuito = (potenciaTotal / totalIUG) * bocasEnEsteCircuito;
    const intensidadCarga = potenciaCircuito / 220; // A
    const proteccion = seleccionarProteccionYCable(intensidadCarga);
    circuitos.push({
      numero: numeroCircuito,
      bocas: bocasEnEsteCircuito,
      potencia: potenciaCircuito,
      intensidadCarga,
      proteccion
    });
    bocasRestantes -= bocasEnEsteCircuito;
    numeroCircuito++;
  }

  return circuitos;
}

export function calculateElectricalRequirements(spaces: Space[]) {
  let areaTotal = 0;
  let totalIUG = 0;
  let totalTUG = 0;
  let totalPotenciaIluminacion = 0;

  const espacios = spaces.map(space => {
    const area = space.type.toLowerCase() === "otros (semicubierto)" ? (space.length * space.width) / 2 : space.length * space.width;
    areaTotal += area;

    const [iug, tug] = calcularBocas(space.type, area, ""); // We'll determine grado later
    totalIUG += iug;
    totalTUG += tug;

    const potenciaIluminacion = iug * 60 * (2/3);
    totalPotenciaIluminacion += potenciaIluminacion;

    return {
      tipo: space.type,
      area,
      iug,
      tug,
      potenciaIluminacion
    };
  });

  const gradoElectrificacion = calcularGradoElectrificacion(areaTotal);

  const circuitosTUG = calcularCircuitosTUG(totalTUG);
  const circuitosIUG = calcularCircuitosIUG(totalIUG, totalPotenciaIluminacion);

  return {
    gradoElectrificacion,
    espacios,
    totales: {
      areaTotal,
      totalIUG,
      totalTUG,
      totalPotenciaIluminacion,
      circuitosTUG,
      circuitosIUG
    }
  };
}

function calcularGradoElectrificacion(areaTotal: number): string {
  if (areaTotal < 60) return "bajo";
  if (areaTotal <= 130) return "medio";
  if (areaTotal <= 200) return "elevado";
  return "superior";
}

function calcularBocas(tipoEspacio: string, area: number, gradoElectrificacion: string): [number, number] {
  let iug = 0;
  let tug = 0;

  switch (tipoEspacio.toLowerCase()) {
    case "sala":
    case "comedor":
    case "estudio":
    case "biblioteca":
      iug = Math.ceil(Math.max(1, area / 18));
      tug = Math.ceil(Math.max(2, area / 6));
      break;
    case "dormitorio":
      if (area < 10) {
        iug = 1;
        tug = 2;
      } else if (area <= 36) {
        iug = 1;
        tug = 3;
      } else {
        iug = 2;
        tug = 3;
      }
      break;
    case "cocina":
      iug = gradoElectrificacion === "bajo" ? 1 : 2;
      tug = 5;
      break;
    case "baño":
      iug = 1;
      tug = 1;
      break;
    case "vestíbulo":
    case "garaje":
    case "hall":
      if (gradoElectrificacion === "bajo") {
        iug = 1;
        tug = 1;
      } else {
        iug = Math.ceil(Math.max(1, area / 12));
        tug = Math.ceil(Math.max(1, area / 12));
      }
      break;
    case "pasillo":
      iug = Math.ceil(Math.max(1, area / 5));
      tug = gradoElectrificacion !== "bajo" && area > 2 ? 1 : 0;
      break;
    case "lavadero":
      iug = 1;
      tug = gradoElectrificacion === "bajo" ? 1 : 2;
      break;
    case "balcón":
    case "galería":
      iug = Math.ceil(Math.max(1, area / 5));
      tug = 0;
      break;
    default:
      iug = 0;
      tug = 0;
  }

  return [iug, tug];
}