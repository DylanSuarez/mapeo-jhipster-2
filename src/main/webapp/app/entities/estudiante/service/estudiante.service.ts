import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEstudiante, getEstudianteIdentifier } from '../estudiante.model';

export type EntityResponseType = HttpResponse<IEstudiante>;
export type EntityArrayResponseType = HttpResponse<IEstudiante[]>;

@Injectable({ providedIn: 'root' })
export class EstudianteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/estudiantes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(estudiante: IEstudiante): Observable<EntityResponseType> {
    return this.http.post<IEstudiante>(this.resourceUrl, estudiante, { observe: 'response' });
  }

  update(estudiante: IEstudiante): Observable<EntityResponseType> {
    return this.http.put<IEstudiante>(`${this.resourceUrl}/${getEstudianteIdentifier(estudiante) as number}`, estudiante, {
      observe: 'response',
    });
  }

  partialUpdate(estudiante: IEstudiante): Observable<EntityResponseType> {
    return this.http.patch<IEstudiante>(`${this.resourceUrl}/${getEstudianteIdentifier(estudiante) as number}`, estudiante, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEstudiante>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEstudiante[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEstudianteToCollectionIfMissing(
    estudianteCollection: IEstudiante[],
    ...estudiantesToCheck: (IEstudiante | null | undefined)[]
  ): IEstudiante[] {
    const estudiantes: IEstudiante[] = estudiantesToCheck.filter(isPresent);
    if (estudiantes.length > 0) {
      const estudianteCollectionIdentifiers = estudianteCollection.map(estudianteItem => getEstudianteIdentifier(estudianteItem)!);
      const estudiantesToAdd = estudiantes.filter(estudianteItem => {
        const estudianteIdentifier = getEstudianteIdentifier(estudianteItem);
        if (estudianteIdentifier == null || estudianteCollectionIdentifiers.includes(estudianteIdentifier)) {
          return false;
        }
        estudianteCollectionIdentifiers.push(estudianteIdentifier);
        return true;
      });
      return [...estudiantesToAdd, ...estudianteCollection];
    }
    return estudianteCollection;
  }
}
