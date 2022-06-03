import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClaseFicha, getClaseFichaIdentifier } from '../clase-ficha.model';

export type EntityResponseType = HttpResponse<IClaseFicha>;
export type EntityArrayResponseType = HttpResponse<IClaseFicha[]>;

@Injectable({ providedIn: 'root' })
export class ClaseFichaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/clase-fichas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(claseFicha: IClaseFicha): Observable<EntityResponseType> {
    return this.http.post<IClaseFicha>(this.resourceUrl, claseFicha, { observe: 'response' });
  }

  update(claseFicha: IClaseFicha): Observable<EntityResponseType> {
    return this.http.put<IClaseFicha>(`${this.resourceUrl}/${getClaseFichaIdentifier(claseFicha) as number}`, claseFicha, {
      observe: 'response',
    });
  }

  partialUpdate(claseFicha: IClaseFicha): Observable<EntityResponseType> {
    return this.http.patch<IClaseFicha>(`${this.resourceUrl}/${getClaseFichaIdentifier(claseFicha) as number}`, claseFicha, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClaseFicha>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClaseFicha[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addClaseFichaToCollectionIfMissing(
    claseFichaCollection: IClaseFicha[],
    ...claseFichasToCheck: (IClaseFicha | null | undefined)[]
  ): IClaseFicha[] {
    const claseFichas: IClaseFicha[] = claseFichasToCheck.filter(isPresent);
    if (claseFichas.length > 0) {
      const claseFichaCollectionIdentifiers = claseFichaCollection.map(claseFichaItem => getClaseFichaIdentifier(claseFichaItem)!);
      const claseFichasToAdd = claseFichas.filter(claseFichaItem => {
        const claseFichaIdentifier = getClaseFichaIdentifier(claseFichaItem);
        if (claseFichaIdentifier == null || claseFichaCollectionIdentifiers.includes(claseFichaIdentifier)) {
          return false;
        }
        claseFichaCollectionIdentifiers.push(claseFichaIdentifier);
        return true;
      });
      return [...claseFichasToAdd, ...claseFichaCollection];
    }
    return claseFichaCollection;
  }
}
