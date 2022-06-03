import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { IClaseFicha } from 'app/entities/clase-ficha/clase-ficha.model';
import { IProgramaDeFormacion } from 'app/entities/programa-de-formacion/programa-de-formacion.model';
import { State } from 'app/entities/enumerations/state.model';

export interface IFicha {
  id?: number;
  nombreFicha?: string;
  estadoFicha?: State;
  estudiantes?: IEstudiante[] | null;
  claseFichas?: IClaseFicha[] | null;
  programadeformacion?: IProgramaDeFormacion | null;
}

export class Ficha implements IFicha {
  constructor(
    public id?: number,
    public nombreFicha?: string,
    public estadoFicha?: State,
    public estudiantes?: IEstudiante[] | null,
    public claseFichas?: IClaseFicha[] | null,
    public programadeformacion?: IProgramaDeFormacion | null
  ) {}
}

export function getFichaIdentifier(ficha: IFicha): number | undefined {
  return ficha.id;
}
