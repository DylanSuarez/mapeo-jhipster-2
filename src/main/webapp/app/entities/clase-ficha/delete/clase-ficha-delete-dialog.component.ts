import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IClaseFicha } from '../clase-ficha.model';
import { ClaseFichaService } from '../service/clase-ficha.service';

@Component({
  templateUrl: './clase-ficha-delete-dialog.component.html',
})
export class ClaseFichaDeleteDialogComponent {
  claseFicha?: IClaseFicha;

  constructor(protected claseFichaService: ClaseFichaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.claseFichaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
