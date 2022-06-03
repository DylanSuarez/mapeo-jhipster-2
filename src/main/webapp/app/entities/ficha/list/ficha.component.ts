import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFicha } from '../ficha.model';
import { FichaService } from '../service/ficha.service';
import { FichaDeleteDialogComponent } from '../delete/ficha-delete-dialog.component';

@Component({
  selector: 'fsis-ficha',
  templateUrl: './ficha.component.html',
})
export class FichaComponent implements OnInit {
  fichas?: IFicha[];
  isLoading = false;

  constructor(protected fichaService: FichaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.fichaService.query().subscribe({
      next: (res: HttpResponse<IFicha[]>) => {
        this.isLoading = false;
        this.fichas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFicha): number {
    return item.id!;
  }

  delete(ficha: IFicha): void {
    const modalRef = this.modalService.open(FichaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ficha = ficha;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
