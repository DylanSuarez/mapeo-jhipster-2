import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEstudianteHorario } from '../estudiante-horario.model';

@Component({
  selector: 'fsis-estudiante-horario-detail',
  templateUrl: './estudiante-horario-detail.component.html',
})
export class EstudianteHorarioDetailComponent implements OnInit {
  estudianteHorario: IEstudianteHorario | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estudianteHorario }) => {
      this.estudianteHorario = estudianteHorario;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
