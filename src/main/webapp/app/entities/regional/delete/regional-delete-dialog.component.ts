import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRegional } from '../regional.model';
import { RegionalService } from '../service/regional.service';

@Component({
  templateUrl: './regional-delete-dialog.component.html',
})
export class RegionalDeleteDialogComponent {
  regional?: IRegional;

  constructor(protected regionalService: RegionalService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.regionalService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
