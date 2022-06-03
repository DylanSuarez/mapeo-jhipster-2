import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClase, Clase } from '../clase.model';
import { ClaseService } from '../service/clase.service';

@Injectable({ providedIn: 'root' })
export class ClaseRoutingResolveService implements Resolve<IClase> {
  constructor(protected service: ClaseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IClase> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((clase: HttpResponse<Clase>) => {
          if (clase.body) {
            return of(clase.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Clase());
  }
}
