import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFicha } from '../ficha.model';
import { FichaService } from '../service/ficha.service';

@Component({
  templateUrl: './ficha-delete-dialog.component.html',
})
export class FichaDeleteDialogComponent {
  ficha?: IFicha;

  constructor(protected fichaService: FichaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fichaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
