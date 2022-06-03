import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEstudianteHorario, getEstudianteHorarioIdentifier } from '../estudiante-horario.model';

export type EntityResponseType = HttpResponse<IEstudianteHorario>;
export type EntityArrayResponseType = HttpResponse<IEstudianteHorario[]>;

@Injectable({ providedIn: 'root' })
export class EstudianteHorarioService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/estudiante-horarios');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(estudianteHorario: IEstudianteHorario): Observable<EntityResponseType> {
    return this.http.post<IEstudianteHorario>(this.resourceUrl, estudianteHorario, { observe: 'response' });
  }

  update(estudianteHorario: IEstudianteHorario): Observable<EntityResponseType> {
    return this.http.put<IEstudianteHorario>(
      `${this.resourceUrl}/${getEstudianteHorarioIdentifier(estudianteHorario) as number}`,
      estudianteHorario,
      { observe: 'response' }
    );
  }

  partialUpdate(estudianteHorario: IEstudianteHorario): Observable<EntityResponseType> {
    return this.http.patch<IEstudianteHorario>(
      `${this.resourceUrl}/${getEstudianteHorarioIdentifier(estudianteHorario) as number}`,
      estudianteHorario,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEstudianteHorario>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEstudianteHorario[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEstudianteHorarioToCollectionIfMissing(
    estudianteHorarioCollection: IEstudianteHorario[],
    ...estudianteHorariosToCheck: (IEstudianteHorario | null | undefined)[]
  ): IEstudianteHorario[] {
    const estudianteHorarios: IEstudianteHorario[] = estudianteHorariosToCheck.filter(isPresent);
    if (estudianteHorarios.length > 0) {
      const estudianteHorarioCollectionIdentifiers = estudianteHorarioCollection.map(
        estudianteHorarioItem => getEstudianteHorarioIdentifier(estudianteHorarioItem)!
      );
      const estudianteHorariosToAdd = estudianteHorarios.filter(estudianteHorarioItem => {
        const estudianteHorarioIdentifier = getEstudianteHorarioIdentifier(estudianteHorarioItem);
        if (estudianteHorarioIdentifier == null || estudianteHorarioCollectionIdentifiers.includes(estudianteHorarioIdentifier)) {
          return false;
        }
        estudianteHorarioCollectionIdentifiers.push(estudianteHorarioIdentifier);
        return true;
      });
      return [...estudianteHorariosToAdd, ...estudianteHorarioCollection];
    }
    return estudianteHorarioCollection;
  }
}
