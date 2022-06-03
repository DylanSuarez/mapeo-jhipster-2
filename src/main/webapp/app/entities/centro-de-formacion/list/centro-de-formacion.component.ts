import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICentroDeFormacion } from '../centro-de-formacion.model';
import { CentroDeFormacionService } from '../service/centro-de-formacion.service';
import { CentroDeFormacionDeleteDialogComponent } from '../delete/centro-de-formacion-delete-dialog.component';

@Component({
  selector: 'fsis-centro-de-formacion',
  templateUrl: './centro-de-formacion.component.html',
})
export class CentroDeFormacionComponent implements OnInit {
  centroDeFormacions?: ICentroDeFormacion[];
  isLoading = false;

  constructor(protected centroDeFormacionService: CentroDeFormacionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.centroDeFormacionService.query().subscribe({
      next: (res: HttpResponse<ICentroDeFormacion[]>) => {
        this.isLoading = false;
        this.centroDeFormacions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ICentroDeFormacion): number {
    return item.id!;
  }

  delete(centroDeFormacion: ICentroDeFormacion): void {
    const modalRef = this.modalService.open(CentroDeFormacionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.centroDeFormacion = centroDeFormacion;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
