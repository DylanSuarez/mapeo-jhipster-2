import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProgramaDeFormacion } from '../programa-de-formacion.model';
import { ProgramaDeFormacionService } from '../service/programa-de-formacion.service';
import { ProgramaDeFormacionDeleteDialogComponent } from '../delete/programa-de-formacion-delete-dialog.component';

@Component({
  selector: 'fsis-programa-de-formacion',
  templateUrl: './programa-de-formacion.component.html',
})
export class ProgramaDeFormacionComponent implements OnInit {
  programaDeFormacions?: IProgramaDeFormacion[];
  isLoading = false;

  constructor(protected programaDeFormacionService: ProgramaDeFormacionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.programaDeFormacionService.query().subscribe({
      next: (res: HttpResponse<IProgramaDeFormacion[]>) => {
        this.isLoading = false;
        this.programaDeFormacions = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IProgramaDeFormacion): number {
    return item.id!;
  }

  delete(programaDeFormacion: IProgramaDeFormacion): void {
    const modalRef = this.modalService.open(ProgramaDeFormacionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.programaDeFormacion = programaDeFormacion;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
