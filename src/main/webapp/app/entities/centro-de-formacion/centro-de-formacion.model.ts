import { IDocente } from 'app/entities/docente/docente.model';
import { IAdmin } from 'app/entities/admin/admin.model';
import { IProgramaDeFormacion } from 'app/entities/programa-de-formacion/programa-de-formacion.model';
import { IRegional } from 'app/entities/regional/regional.model';

export interface ICentroDeFormacion {
  id?: number;
  nombreCentro?: string;
  docentes?: IDocente[] | null;
  admins?: IAdmin[] | null;
  programaDeFormacions?: IProgramaDeFormacion[] | null;
  regional?: IRegional | null;
}

export class CentroDeFormacion implements ICentroDeFormacion {
  constructor(
    public id?: number,
    public nombreCentro?: string,
    public docentes?: IDocente[] | null,
    public admins?: IAdmin[] | null,
    public programaDeFormacions?: IProgramaDeFormacion[] | null,
    public regional?: IRegional | null
  ) {}
}

export function getCentroDeFormacionIdentifier(centroDeFormacion: ICentroDeFormacion): number | undefined {
  return centroDeFormacion.id;
}
