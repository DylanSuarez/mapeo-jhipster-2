import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IClaseFicha } from '../clase-ficha.model';

@Component({
  selector: 'fsis-clase-ficha-detail',
  templateUrl: './clase-ficha-detail.component.html',
})
export class ClaseFichaDetailComponent implements OnInit {
  claseFicha: IClaseFicha | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ claseFicha }) => {
      this.claseFicha = claseFicha;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
