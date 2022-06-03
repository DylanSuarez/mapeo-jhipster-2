import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRegional, Regional } from '../regional.model';
import { RegionalService } from '../service/regional.service';

@Injectable({ providedIn: 'root' })
export class RegionalRoutingResolveService implements Resolve<IRegional> {
  constructor(protected service: RegionalService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRegional> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((regional: HttpResponse<Regional>) => {
          if (regional.body) {
            return of(regional.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Regional());
  }
}
