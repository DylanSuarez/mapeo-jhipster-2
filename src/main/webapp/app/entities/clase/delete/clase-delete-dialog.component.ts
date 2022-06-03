import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IClase } from '../clase.model';
import { ClaseService } from '../service/clase.service';

@Component({
  templateUrl: './clase-delete-dialog.component.html',
})
export class ClaseDeleteDialogComponent {
  clase?: IClase;

  constructor(protected claseService: ClaseService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.claseService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
