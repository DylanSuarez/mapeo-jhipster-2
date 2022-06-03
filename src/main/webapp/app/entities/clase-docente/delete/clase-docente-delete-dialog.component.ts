import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IClaseDocente } from '../clase-docente.model';
import { ClaseDocenteService } from '../service/clase-docente.service';

@Component({
  templateUrl: './clase-docente-delete-dialog.component.html',
})
export class ClaseDocenteDeleteDialogComponent {
  claseDocente?: IClaseDocente;

  constructor(protected claseDocenteService: ClaseDocenteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.claseDocenteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
