import { ICustomer } from 'app/entities/customer/customer.model';
import { ICentroDeFormacion } from 'app/entities/centro-de-formacion/centro-de-formacion.model';

export interface IAdmin {
  id?: number;
  cargo?: string;
  customer?: ICustomer | null;
  centroDeFormacion?: ICentroDeFormacion | null;
}

export class Admin implements IAdmin {
  constructor(
    public id?: number,
    public cargo?: string,
    public customer?: ICustomer | null,
    public centroDeFormacion?: ICentroDeFormacion | null
  ) {}
}

export function getAdminIdentifier(admin: IAdmin): number | undefined {
  return admin.id;
}
