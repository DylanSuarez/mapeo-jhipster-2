import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICentroDeFormacion } from '../centro-de-formacion.model';

@Component({
  selector: 'fsis-centro-de-formacion-detail',
  templateUrl: './centro-de-formacion-detail.component.html',
})
export class CentroDeFormacionDetailComponent implements OnInit {
  centroDeFormacion: ICentroDeFormacion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ centroDeFormacion }) => {
      this.centroDeFormacion = centroDeFormacion;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
