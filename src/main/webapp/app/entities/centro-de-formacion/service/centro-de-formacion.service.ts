import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICentroDeFormacion, getCentroDeFormacionIdentifier } from '../centro-de-formacion.model';

export type EntityResponseType = HttpResponse<ICentroDeFormacion>;
export type EntityArrayResponseType = HttpResponse<ICentroDeFormacion[]>;

@Injectable({ providedIn: 'root' })
export class CentroDeFormacionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/centro-de-formacions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(centroDeFormacion: ICentroDeFormacion): Observable<EntityResponseType> {
    return this.http.post<ICentroDeFormacion>(this.resourceUrl, centroDeFormacion, { observe: 'response' });
  }

  update(centroDeFormacion: ICentroDeFormacion): Observable<EntityResponseType> {
    return this.http.put<ICentroDeFormacion>(
      `${this.resourceUrl}/${getCentroDeFormacionIdentifier(centroDeFormacion) as number}`,
      centroDeFormacion,
      { observe: 'response' }
    );
  }

  partialUpdate(centroDeFormacion: ICentroDeFormacion): Observable<EntityResponseType> {
    return this.http.patch<ICentroDeFormacion>(
      `${this.resourceUrl}/${getCentroDeFormacionIdentifier(centroDeFormacion) as number}`,
      centroDeFormacion,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICentroDeFormacion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICentroDeFormacion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCentroDeFormacionToCollectionIfMissing(
    centroDeFormacionCollection: ICentroDeFormacion[],
    ...centroDeFormacionsToCheck: (ICentroDeFormacion | null | undefined)[]
  ): ICentroDeFormacion[] {
    const centroDeFormacions: ICentroDeFormacion[] = centroDeFormacionsToCheck.filter(isPresent);
    if (centroDeFormacions.length > 0) {
      const centroDeFormacionCollectionIdentifiers = centroDeFormacionCollection.map(
        centroDeFormacionItem => getCentroDeFormacionIdentifier(centroDeFormacionItem)!
      );
      const centroDeFormacionsToAdd = centroDeFormacions.filter(centroDeFormacionItem => {
        const centroDeFormacionIdentifier = getCentroDeFormacionIdentifier(centroDeFormacionItem);
        if (centroDeFormacionIdentifier == null || centroDeFormacionCollectionIdentifiers.includes(centroDeFormacionIdentifier)) {
          return false;
        }
        centroDeFormacionCollectionIdentifiers.push(centroDeFormacionIdentifier);
        return true;
      });
      return [...centroDeFormacionsToAdd, ...centroDeFormacionCollection];
    }
    return centroDeFormacionCollection;
  }
}
