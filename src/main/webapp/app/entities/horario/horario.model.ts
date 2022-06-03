import dayjs from 'dayjs/esm';
import { IEstudianteHorario } from 'app/entities/estudiante-horario/estudiante-horario.model';
import { IClaseDocente } from 'app/entities/clase-docente/clase-docente.model';

export interface IHorario {
  id?: number;
  horaInicio?: dayjs.Dayjs;
  horaFinal?: dayjs.Dayjs;
  fecha?: dayjs.Dayjs;
  jornada?: string;
  estudianteHorarios?: IEstudianteHorario[] | null;
  claseDocentes?: IClaseDocente[] | null;
}

export class Horario implements IHorario {
  constructor(
    public id?: number,
    public horaInicio?: dayjs.Dayjs,
    public horaFinal?: dayjs.Dayjs,
    public fecha?: dayjs.Dayjs,
    public jornada?: string,
    public estudianteHorarios?: IEstudianteHorario[] | null,
    public claseDocentes?: IClaseDocente[] | null
  ) {}
}

export function getHorarioIdentifier(horario: IHorario): number | undefined {
  return horario.id;
}
