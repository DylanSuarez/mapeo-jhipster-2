import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITrimestre, Trimestre } from '../trimestre.model';
import { TrimestreService } from '../service/trimestre.service';

@Injectable({ providedIn: 'root' })
export class TrimestreRoutingResolveService implements Resolve<ITrimestre> {
  constructor(protected service: TrimestreService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITrimestre> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((trimestre: HttpResponse<Trimestre>) => {
          if (trimestre.body) {
            return of(trimestre.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Trimestre());
  }
}
