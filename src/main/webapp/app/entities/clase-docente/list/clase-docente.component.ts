import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IClaseDocente } from '../clase-docente.model';
import { ClaseDocenteService } from '../service/clase-docente.service';
import { ClaseDocenteDeleteDialogComponent } from '../delete/clase-docente-delete-dialog.component';

@Component({
  selector: 'fsis-clase-docente',
  templateUrl: './clase-docente.component.html',
})
export class ClaseDocenteComponent implements OnInit {
  claseDocentes?: IClaseDocente[];
  isLoading = false;

  constructor(protected claseDocenteService: ClaseDocenteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.claseDocenteService.query().subscribe({
      next: (res: HttpResponse<IClaseDocente[]>) => {
        this.isLoading = false;
        this.claseDocentes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IClaseDocente): number {
    return item.id!;
  }

  delete(claseDocente: IClaseDocente): void {
    const modalRef = this.modalService.open(ClaseDocenteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.claseDocente = claseDocente;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
