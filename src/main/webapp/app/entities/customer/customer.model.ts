import { IUser } from 'app/entities/user/user.model';
import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { IAdmin } from 'app/entities/admin/admin.model';
import { IDocente } from 'app/entities/docente/docente.model';
import { ITipoDocumento } from 'app/entities/tipo-documento/tipo-documento.model';

export interface ICustomer {
  id?: number;
  numDocumento?: string;
  primerNombre?: string;
  segundoNombre?: string | null;
  primerApellido?: string;
  segundoApellido?: string | null;
  user?: IUser;
  estudiantes?: IEstudiante[] | null;
  admins?: IAdmin[] | null;
  docentes?: IDocente[] | null;
  tipoDocumento?: ITipoDocumento | null;
}

export class Customer implements ICustomer {
  constructor(
    public id?: number,
    public numDocumento?: string,
    public primerNombre?: string,
    public segundoNombre?: string | null,
    public primerApellido?: string,
    public segundoApellido?: string | null,
    public user?: IUser,
    public estudiantes?: IEstudiante[] | null,
    public admins?: IAdmin[] | null,
    public docentes?: IDocente[] | null,
    public tipoDocumento?: ITipoDocumento | null
  ) {}
}

export function getCustomerIdentifier(customer: ICustomer): number | undefined {
  return customer.id;
}
