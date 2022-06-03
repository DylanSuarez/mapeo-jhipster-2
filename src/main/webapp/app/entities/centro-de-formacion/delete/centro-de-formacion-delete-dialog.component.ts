import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICentroDeFormacion } from '../centro-de-formacion.model';
import { CentroDeFormacionService } from '../service/centro-de-formacion.service';

@Component({
  templateUrl: './centro-de-formacion-delete-dialog.component.html',
})
export class CentroDeFormacionDeleteDialogComponent {
  centroDeFormacion?: ICentroDeFormacion;

  constructor(protected centroDeFormacionService: CentroDeFormacionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.centroDeFormacionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
