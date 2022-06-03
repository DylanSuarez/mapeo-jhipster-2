import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IHorario } from '../horario.model';
import { HorarioService } from '../service/horario.service';
import { HorarioDeleteDialogComponent } from '../delete/horario-delete-dialog.component';

@Component({
  selector: 'fsis-horario',
  templateUrl: './horario.component.html',
})
export class HorarioComponent implements OnInit {
  horarios?: IHorario[];
  isLoading = false;

  constructor(protected horarioService: HorarioService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.horarioService.query().subscribe({
      next: (res: HttpResponse<IHorario[]>) => {
        this.isLoading = false;
        this.horarios = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IHorario): number {
    return item.id!;
  }

  delete(horario: IHorario): void {
    const modalRef = this.modalService.open(HorarioDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.horario = horario;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
