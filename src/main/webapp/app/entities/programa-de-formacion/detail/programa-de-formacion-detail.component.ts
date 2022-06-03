import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProgramaDeFormacion } from '../programa-de-formacion.model';

@Component({
  selector: 'fsis-programa-de-formacion-detail',
  templateUrl: './programa-de-formacion-detail.component.html',
})
export class ProgramaDeFormacionDetailComponent implements OnInit {
  programaDeFormacion: IProgramaDeFormacion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ programaDeFormacion }) => {
      this.programaDeFormacion = programaDeFormacion;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
