import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICentroDeFormacion, CentroDeFormacion } from '../centro-de-formacion.model';
import { CentroDeFormacionService } from '../service/centro-de-formacion.service';

@Injectable({ providedIn: 'root' })
export class CentroDeFormacionRoutingResolveService implements Resolve<ICentroDeFormacion> {
  constructor(protected service: CentroDeFormacionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICentroDeFormacion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((centroDeFormacion: HttpResponse<CentroDeFormacion>) => {
          if (centroDeFormacion.body) {
            return of(centroDeFormacion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new CentroDeFormacion());
  }
}
