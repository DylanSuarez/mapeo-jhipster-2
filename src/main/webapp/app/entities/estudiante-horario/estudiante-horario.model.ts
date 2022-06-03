import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { IHorario } from 'app/entities/horario/horario.model';

export interface IEstudianteHorario {
  id?: number;
  estudiante?: IEstudiante | null;
  horario?: IHorario | null;
}

export class EstudianteHorario implements IEstudianteHorario {
  constructor(public id?: number, public estudiante?: IEstudiante | null, public horario?: IHorario | null) {}
}

export function getEstudianteHorarioIdentifier(estudianteHorario: IEstudianteHorario): number | undefined {
  return estudianteHorario.id;
}
