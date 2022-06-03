import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEstudianteHorario } from '../estudiante-horario.model';
import { EstudianteHorarioService } from '../service/estudiante-horario.service';
import { EstudianteHorarioDeleteDialogComponent } from '../delete/estudiante-horario-delete-dialog.component';

@Component({
  selector: 'fsis-estudiante-horario',
  templateUrl: './estudiante-horario.component.html',
})
export class EstudianteHorarioComponent implements OnInit {
  estudianteHorarios?: IEstudianteHorario[];
  isLoading = false;

  constructor(protected estudianteHorarioService: EstudianteHorarioService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.estudianteHorarioService.query().subscribe({
      next: (res: HttpResponse<IEstudianteHorario[]>) => {
        this.isLoading = false;
        this.estudianteHorarios = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IEstudianteHorario): number {
    return item.id!;
  }

  delete(estudianteHorario: IEstudianteHorario): void {
    const modalRef = this.modalService.open(EstudianteHorarioDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.estudianteHorario = estudianteHorario;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
