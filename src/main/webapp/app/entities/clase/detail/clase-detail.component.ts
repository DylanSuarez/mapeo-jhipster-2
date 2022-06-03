import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IClase } from '../clase.model';

@Component({
  selector: 'fsis-clase-detail',
  templateUrl: './clase-detail.component.html',
})
export class ClaseDetailComponent implements OnInit {
  clase: IClase | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clase }) => {
      this.clase = clase;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
