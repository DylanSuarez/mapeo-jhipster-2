import { ICentroDeFormacion } from 'app/entities/centro-de-formacion/centro-de-formacion.model';

export interface IRegional {
  id?: number;
  nombreRegional?: string;
  centroDeFormacions?: ICentroDeFormacion[] | null;
}

export class Regional implements IRegional {
  constructor(public id?: number, public nombreRegional?: string, public centroDeFormacions?: ICentroDeFormacion[] | null) {}
}

export function getRegionalIdentifier(regional: IRegional): number | undefined {
  return regional.id;
}
