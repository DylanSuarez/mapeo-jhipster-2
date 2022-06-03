import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IClaseDocente } from '../clase-docente.model';

@Component({
  selector: 'fsis-clase-docente-detail',
  templateUrl: './clase-docente-detail.component.html',
})
export class ClaseDocenteDetailComponent implements OnInit {
  claseDocente: IClaseDocente | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ claseDocente }) => {
      this.claseDocente = claseDocente;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
