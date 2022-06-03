import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { IClase } from 'app/entities/clase/clase.model';

export interface ITrimestre {
  id?: number;
  numTrimestre?: string;
  estudiantes?: IEstudiante[] | null;
  clases?: IClase[] | null;
}

export class Trimestre implements ITrimestre {
  constructor(
    public id?: number,
    public numTrimestre?: string,
    public estudiantes?: IEstudiante[] | null,
    public clases?: IClase[] | null
  ) {}
}

export function getTrimestreIdentifier(trimestre: ITrimestre): number | undefined {
  return trimestre.id;
}
