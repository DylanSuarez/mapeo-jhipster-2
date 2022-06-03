import { IProgramaDeFormacion } from 'app/entities/programa-de-formacion/programa-de-formacion.model';

export interface IClaseProgramaDeFormacion {
  id?: number;
  programadeformacion?: IProgramaDeFormacion | null;
}

export class ClaseProgramaDeFormacion implements IClaseProgramaDeFormacion {
  constructor(public id?: number, public programadeformacion?: IProgramaDeFormacion | null) {}
}

export function getClaseProgramaDeFormacionIdentifier(claseProgramaDeFormacion: IClaseProgramaDeFormacion): number | undefined {
  return claseProgramaDeFormacion.id;
}
