import { IClaseDocente } from 'app/entities/clase-docente/clase-docente.model';
import { IProgramaDeFormacion } from 'app/entities/programa-de-formacion/programa-de-formacion.model';
import { IClaseFicha } from 'app/entities/clase-ficha/clase-ficha.model';
import { ITrimestre } from 'app/entities/trimestre/trimestre.model';

export interface IClase {
  id?: number;
  nombreClase?: string;
  claseDocentes?: IClaseDocente[] | null;
  programaDeFormacions?: IProgramaDeFormacion[] | null;
  claseFichas?: IClaseFicha[] | null;
  trimestre?: ITrimestre | null;
}

export class Clase implements IClase {
  constructor(
    public id?: number,
    public nombreClase?: string,
    public claseDocentes?: IClaseDocente[] | null,
    public programaDeFormacions?: IProgramaDeFormacion[] | null,
    public claseFichas?: IClaseFicha[] | null,
    public trimestre?: ITrimestre | null
  ) {}
}

export function getClaseIdentifier(clase: IClase): number | undefined {
  return clase.id;
}
