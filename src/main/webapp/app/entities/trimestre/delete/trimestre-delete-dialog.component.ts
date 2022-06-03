import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITrimestre } from '../trimestre.model';
import { TrimestreService } from '../service/trimestre.service';

@Component({
  templateUrl: './trimestre-delete-dialog.component.html',
})
export class TrimestreDeleteDialogComponent {
  trimestre?: ITrimestre;

  constructor(protected trimestreService: TrimestreService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.trimestreService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
