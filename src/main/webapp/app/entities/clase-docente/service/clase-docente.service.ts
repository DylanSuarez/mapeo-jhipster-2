import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClaseDocente, getClaseDocenteIdentifier } from '../clase-docente.model';

export type EntityResponseType = HttpResponse<IClaseDocente>;
export type EntityArrayResponseType = HttpResponse<IClaseDocente[]>;

@Injectable({ providedIn: 'root' })
export class ClaseDocenteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/clase-docentes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(claseDocente: IClaseDocente): Observable<EntityResponseType> {
    return this.http.post<IClaseDocente>(this.resourceUrl, claseDocente, { observe: 'response' });
  }

  update(claseDocente: IClaseDocente): Observable<EntityResponseType> {
    return this.http.put<IClaseDocente>(`${this.resourceUrl}/${getClaseDocenteIdentifier(claseDocente) as number}`, claseDocente, {
      observe: 'response',
    });
  }

  partialUpdate(claseDocente: IClaseDocente): Observable<EntityResponseType> {
    return this.http.patch<IClaseDocente>(`${this.resourceUrl}/${getClaseDocenteIdentifier(claseDocente) as number}`, claseDocente, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClaseDocente>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClaseDocente[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addClaseDocenteToCollectionIfMissing(
    claseDocenteCollection: IClaseDocente[],
    ...claseDocentesToCheck: (IClaseDocente | null | undefined)[]
  ): IClaseDocente[] {
    const claseDocentes: IClaseDocente[] = claseDocentesToCheck.filter(isPresent);
    if (claseDocentes.length > 0) {
      const claseDocenteCollectionIdentifiers = claseDocenteCollection.map(
        claseDocenteItem => getClaseDocenteIdentifier(claseDocenteItem)!
      );
      const claseDocentesToAdd = claseDocentes.filter(claseDocenteItem => {
        const claseDocenteIdentifier = getClaseDocenteIdentifier(claseDocenteItem);
        if (claseDocenteIdentifier == null || claseDocenteCollectionIdentifiers.includes(claseDocenteIdentifier)) {
          return false;
        }
        claseDocenteCollectionIdentifiers.push(claseDocenteIdentifier);
        return true;
      });
      return [...claseDocentesToAdd, ...claseDocenteCollection];
    }
    return claseDocenteCollection;
  }
}
