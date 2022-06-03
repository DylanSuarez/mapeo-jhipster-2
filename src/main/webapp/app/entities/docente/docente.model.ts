import { IClaseDocente } from 'app/entities/clase-docente/clase-docente.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { ICentroDeFormacion } from 'app/entities/centro-de-formacion/centro-de-formacion.model';

export interface IDocente {
  id?: number;
  claseDocentes?: IClaseDocente[] | null;
  customer?: ICustomer | null;
  centroDeFormacion?: ICentroDeFormacion | null;
}

export class Docente implements IDocente {
  constructor(
    public id?: number,
    public claseDocentes?: IClaseDocente[] | null,
    public customer?: ICustomer | null,
    public centroDeFormacion?: ICentroDeFormacion | null
  ) {}
}

export function getDocenteIdentifier(docente: IDocente): number | undefined {
  return docente.id;
}
