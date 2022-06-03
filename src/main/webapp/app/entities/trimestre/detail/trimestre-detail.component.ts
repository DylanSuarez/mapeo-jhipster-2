import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITrimestre } from '../trimestre.model';

@Component({
  selector: 'fsis-trimestre-detail',
  templateUrl: './trimestre-detail.component.html',
})
export class TrimestreDetailComponent implements OnInit {
  trimestre: ITrimestre | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trimestre }) => {
      this.trimestre = trimestre;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
