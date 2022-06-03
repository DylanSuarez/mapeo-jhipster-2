import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IClaseProgramaDeFormacion } from '../clase-programa-de-formacion.model';
import { ClaseProgramaDeFormacionService } from '../service/clase-programa-de-formacion.service';
import { ClaseProgramaDeFormacionDeleteDialogComponent } from '../delete/clase-programa-de-formacion-delete-dialog.component';

@Component({
  selector: 'fsis-clase-programa-de-formacion',
  templateUrl: './clase-programa-de-formacion.component.html',
})
export class ClaseProgramaDeFormacionComponent implements OnInit {
  claseProgramaDeFormacions?: IClaseProgramaDeFormacion[];
  isLoading = false;

  constructor(protected claseProgramaDeFormacionService: ClaseProgramaDeFormacionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.claseProgramaDeFormacionService.query().subscribe({
      next: (res: HttpResponse<IClaseProgramaDeFormacion[]>) => {
        this.isLoading = false;
        this.claseProgramaDeFormacions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IClaseProgramaDeFormacion): number {
    return item.id!;
  }

  delete(claseProgramaDeFormacion: IClaseProgramaDeFormacion): void {
    const modalRef = this.modalService.open(ClaseProgramaDeFormacionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.claseProgramaDeFormacion = claseProgramaDeFormacion;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
