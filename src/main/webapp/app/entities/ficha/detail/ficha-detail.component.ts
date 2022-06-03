import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFicha } from '../ficha.model';

@Component({
  selector: 'fsis-ficha-detail',
  templateUrl: './ficha-detail.component.html',
})
export class FichaDetailComponent implements OnInit {
  ficha: IFicha | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ficha }) => {
      this.ficha = ficha;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
