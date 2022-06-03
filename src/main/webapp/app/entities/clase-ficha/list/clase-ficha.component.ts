import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IClaseFicha } from '../clase-ficha.model';
import { ClaseFichaService } from '../service/clase-ficha.service';
import { ClaseFichaDeleteDialogComponent } from '../delete/clase-ficha-delete-dialog.component';

@Component({
  selector: 'fsis-clase-ficha',
  templateUrl: './clase-ficha.component.html',
})
export class ClaseFichaComponent implements OnInit {
  claseFichas?: IClaseFicha[];
  isLoading = false;

  constructor(protected claseFichaService: ClaseFichaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.claseFichaService.query().subscribe({
      next: (res: HttpResponse<IClaseFicha[]>) => {
        this.isLoading = false;
        this.claseFichas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IClaseFicha): number {
    return item.id!;
  }

  delete(claseFicha: IClaseFicha): void {
    const modalRef = this.modalService.open(ClaseFichaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.claseFicha = claseFicha;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
