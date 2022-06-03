import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClaseFicha, ClaseFicha } from '../clase-ficha.model';
import { ClaseFichaService } from '../service/clase-ficha.service';

@Injectable({ providedIn: 'root' })
export class ClaseFichaRoutingResolveService implements Resolve<IClaseFicha> {
  constructor(protected service: ClaseFichaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IClaseFicha> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((claseFicha: HttpResponse<ClaseFicha>) => {
          if (claseFicha.body) {
            return of(claseFicha.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ClaseFicha());
  }
}
