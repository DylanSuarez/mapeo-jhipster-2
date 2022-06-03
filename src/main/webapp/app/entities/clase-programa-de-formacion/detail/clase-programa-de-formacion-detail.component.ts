import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IClaseProgramaDeFormacion } from '../clase-programa-de-formacion.model';

@Component({
  selector: 'fsis-clase-programa-de-formacion-detail',
  templateUrl: './clase-programa-de-formacion-detail.component.html',
})
export class ClaseProgramaDeFormacionDetailComponent implements OnInit {
  claseProgramaDeFormacion: IClaseProgramaDeFormacion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ claseProgramaDeFormacion }) => {
      this.claseProgramaDeFormacion = claseProgramaDeFormacion;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
