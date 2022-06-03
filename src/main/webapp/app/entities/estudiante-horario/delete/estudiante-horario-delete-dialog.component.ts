import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEstudianteHorario } from '../estudiante-horario.model';
import { EstudianteHorarioService } from '../service/estudiante-horario.service';

@Component({
  templateUrl: './estudiante-horario-delete-dialog.component.html',
})
export class EstudianteHorarioDeleteDialogComponent {
  estudianteHorario?: IEstudianteHorario;

  constructor(protected estudianteHorarioService: EstudianteHorarioService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.estudianteHorarioService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
