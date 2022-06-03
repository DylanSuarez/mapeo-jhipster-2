import { IEstudianteHorario } from 'app/entities/estudiante-horario/estudiante-horario.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { IProgramaDeFormacion } from 'app/entities/programa-de-formacion/programa-de-formacion.model';
import { ITrimestre } from 'app/entities/trimestre/trimestre.model';
import { IFicha } from 'app/entities/ficha/ficha.model';

export interface IEstudiante {
  id?: number;
  huella?: number;
  estudianteHorarios?: IEstudianteHorario[] | null;
  customer?: ICustomer | null;
  programadeformacion?: IProgramaDeFormacion | null;
  trimestre?: ITrimestre | null;
  ficha?: IFicha | null;
}

export class Estudiante implements IEstudiante {
  constructor(
    public id?: number,
    public huella?: number,
    public estudianteHorarios?: IEstudianteHorario[] | null,
    public customer?: ICustomer | null,
    public programadeformacion?: IProgramaDeFormacion | null,
    public trimestre?: ITrimestre | null,
    public ficha?: IFicha | null
  ) {}
}

export function getEstudianteIdentifier(estudiante: IEstudiante): number | undefined {
  return estudiante.id;
}
