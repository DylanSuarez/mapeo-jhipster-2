import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProgramaDeFormacion } from '../programa-de-formacion.model';
import { ProgramaDeFormacionService } from '../service/programa-de-formacion.service';

@Component({
  templateUrl: './programa-de-formacion-delete-dialog.component.html',
})
export class ProgramaDeFormacionDeleteDialogComponent {
  programaDeFormacion?: IProgramaDeFormacion;

  constructor(protected programaDeFormacionService: ProgramaDeFormacionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.programaDeFormacionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
