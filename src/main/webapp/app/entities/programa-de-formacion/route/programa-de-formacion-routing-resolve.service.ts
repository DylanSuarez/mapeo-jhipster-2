import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProgramaDeFormacion, ProgramaDeFormacion } from '../programa-de-formacion.model';
import { ProgramaDeFormacionService } from '../service/programa-de-formacion.service';

@Injectable({ providedIn: 'root' })
export class ProgramaDeFormacionRoutingResolveService implements Resolve<IProgramaDeFormacion> {
  constructor(protected service: ProgramaDeFormacionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProgramaDeFormacion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((programaDeFormacion: HttpResponse<ProgramaDeFormacion>) => {
          if (programaDeFormacion.body) {
            return of(programaDeFormacion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProgramaDeFormacion());
  }
}
