import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { IClaseProgramaDeFormacion } from 'app/entities/clase-programa-de-formacion/clase-programa-de-formacion.model';
import { IFicha } from 'app/entities/ficha/ficha.model';
import { ICentroDeFormacion } from 'app/entities/centro-de-formacion/centro-de-formacion.model';
import { IClase } from 'app/entities/clase/clase.model';
import { State } from 'app/entities/enumerations/state.model';

export interface IProgramaDeFormacion {
  id?: number;
  nombrePrograma?: string;
  estadoPrograma?: State;
  estudiantes?: IEstudiante[] | null;
  claseProgramaDeFormacions?: IClaseProgramaDeFormacion[] | null;
  fichas?: IFicha[] | null;
  centroDeFormacion?: ICentroDeFormacion | null;
  clase?: IClase | null;
}

export class ProgramaDeFormacion implements IProgramaDeFormacion {
  constructor(
    public id?: number,
    public nombrePrograma?: string,
    public estadoPrograma?: State,
    public estudiantes?: IEstudiante[] | null,
    public claseProgramaDeFormacions?: IClaseProgramaDeFormacion[] | null,
    public fichas?: IFicha[] | null,
    public centroDeFormacion?: ICentroDeFormacion | null,
    public clase?: IClase | null
  ) {}
}

export function getProgramaDeFormacionIdentifier(programaDeFormacion: IProgramaDeFormacion): number | undefined {
  return programaDeFormacion.id;
}
