import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClaseDocente, ClaseDocente } from '../clase-docente.model';
import { ClaseDocenteService } from '../service/clase-docente.service';

@Injectable({ providedIn: 'root' })
export class ClaseDocenteRoutingResolveService implements Resolve<IClaseDocente> {
  constructor(protected service: ClaseDocenteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IClaseDocente> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((claseDocente: HttpResponse<ClaseDocente>) => {
          if (claseDocente.body) {
            return of(claseDocente.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ClaseDocente());
  }
}
