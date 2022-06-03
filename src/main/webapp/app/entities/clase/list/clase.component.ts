import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IClase } from '../clase.model';
import { ClaseService } from '../service/clase.service';
import { ClaseDeleteDialogComponent } from '../delete/clase-delete-dialog.component';

@Component({
  selector: 'fsis-clase',
  templateUrl: './clase.component.html',
})
export class ClaseComponent implements OnInit {
  clases?: IClase[];
  isLoading = false;

  constructor(protected claseService: ClaseService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.claseService.query().subscribe({
      next: (res: HttpResponse<IClase[]>) => {
        this.isLoading = false;
        this.clases = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IClase): number {
    return item.id!;
  }

  delete(clase: IClase): void {
    const modalRef = this.modalService.open(ClaseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.clase = clase;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
