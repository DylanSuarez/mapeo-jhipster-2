import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRegional } from '../regional.model';

@Component({
  selector: 'fsis-regional-detail',
  templateUrl: './regional-detail.component.html',
})
export class RegionalDetailComponent implements OnInit {
  regional: IRegional | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ regional }) => {
      this.regional = regional;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
