import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITrimestre } from '../trimestre.model';
import { TrimestreService } from '../service/trimestre.service';
import { TrimestreDeleteDialogComponent } from '../delete/trimestre-delete-dialog.component';

@Component({
  selector: 'fsis-trimestre',
  templateUrl: './trimestre.component.html',
})
export class TrimestreComponent implements OnInit {
  trimestres?: ITrimestre[];
  isLoading = false;

  constructor(protected trimestreService: TrimestreService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.trimestreService.query().subscribe({
      next: (res: HttpResponse<ITrimestre[]>) => {
        this.isLoading = false;
        this.trimestres = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ITrimestre): number {
    return item.id!;
  }

  delete(trimestre: ITrimestre): void {
    const modalRef = this.modalService.open(TrimestreDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.trimestre = trimestre;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
