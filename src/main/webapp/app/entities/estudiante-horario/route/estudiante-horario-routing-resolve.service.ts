import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEstudianteHorario, EstudianteHorario } from '../estudiante-horario.model';
import { EstudianteHorarioService } from '../service/estudiante-horario.service';

@Injectable({ providedIn: 'root' })
export class EstudianteHorarioRoutingResolveService implements Resolve<IEstudianteHorario> {
  constructor(protected service: EstudianteHorarioService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEstudianteHorario> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((estudianteHorario: HttpResponse<EstudianteHorario>) => {
          if (estudianteHorario.body) {
            return of(estudianteHorario.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EstudianteHorario());
  }
}
