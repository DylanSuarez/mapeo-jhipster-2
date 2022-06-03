import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IClaseProgramaDeFormacion } from '../clase-programa-de-formacion.model';
import { ClaseProgramaDeFormacionService } from '../service/clase-programa-de-formacion.service';

@Component({
  templateUrl: './clase-programa-de-formacion-delete-dialog.component.html',
})
export class ClaseProgramaDeFormacionDeleteDialogComponent {
  claseProgramaDeFormacion?: IClaseProgramaDeFormacion;

  constructor(protected claseProgramaDeFormacionService: ClaseProgramaDeFormacionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.claseProgramaDeFormacionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
