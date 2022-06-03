import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IClaseProgramaDeFormacion, ClaseProgramaDeFormacion } from '../clase-programa-de-formacion.model';
import { ClaseProgramaDeFormacionService } from '../service/clase-programa-de-formacion.service';

@Injectable({ providedIn: 'root' })
export class ClaseProgramaDeFormacionRoutingResolveService implements Resolve<IClaseProgramaDeFormacion> {
  constructor(protected service: ClaseProgramaDeFormacionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IClaseProgramaDeFormacion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((claseProgramaDeFormacion: HttpResponse<ClaseProgramaDeFormacion>) => {
          if (claseProgramaDeFormacion.body) {
            return of(claseProgramaDeFormacion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ClaseProgramaDeFormacion());
  }
}
