import { IFicha } from 'app/entities/ficha/ficha.model';
import { IClase } from 'app/entities/clase/clase.model';

export interface IClaseFicha {
  id?: number;
  ficha?: IFicha | null;
  clase?: IClase | null;
}

export class ClaseFicha implements IClaseFicha {
  constructor(public id?: number, public ficha?: IFicha | null, public clase?: IClase | null) {}
}

export function getClaseFichaIdentifier(claseFicha: IClaseFicha): number | undefined {
  return claseFicha.id;
}
