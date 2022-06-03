import { IDocente } from 'app/entities/docente/docente.model';
import { IHorario } from 'app/entities/horario/horario.model';
import { IClase } from 'app/entities/clase/clase.model';

export interface IClaseDocente {
  id?: number;
  docente?: IDocente | null;
  horario?: IHorario | null;
  clase?: IClase | null;
}

export class ClaseDocente implements IClaseDocente {
  constructor(public id?: number, public docente?: IDocente | null, public horario?: IHorario | null, public clase?: IClase | null) {}
}

export function getClaseDocenteIdentifier(claseDocente: IClaseDocente): number | undefined {
  return claseDocente.id;
}
