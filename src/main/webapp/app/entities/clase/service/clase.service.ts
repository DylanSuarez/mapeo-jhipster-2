import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClase, getClaseIdentifier } from '../clase.model';

export type EntityResponseType = HttpResponse<IClase>;
export type EntityArrayResponseType = HttpResponse<IClase[]>;

@Injectable({ providedIn: 'root' })
export class ClaseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/clases');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(clase: IClase): Observable<EntityResponseType> {
    return this.http.post<IClase>(this.resourceUrl, clase, { observe: 'response' });
  }

  update(clase: IClase): Observable<EntityResponseType> {
    return this.http.put<IClase>(`${this.resourceUrl}/${getClaseIdentifier(clase) as number}`, clase, { observe: 'response' });
  }

  partialUpdate(clase: IClase): Observable<EntityResponseType> {
    return this.http.patch<IClase>(`${this.resourceUrl}/${getClaseIdentifier(clase) as number}`, clase, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClase>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClase[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addClaseToCollectionIfMissing(claseCollection: IClase[], ...clasesToCheck: (IClase | null | undefined)[]): IClase[] {
    const clases: IClase[] = clasesToCheck.filter(isPresent);
    if (clases.length > 0) {
      const claseCollectionIdentifiers = claseCollection.map(claseItem => getClaseIdentifier(claseItem)!);
      const clasesToAdd = clases.filter(claseItem => {
        const claseIdentifier = getClaseIdentifier(claseItem);
        if (claseIdentifier == null || claseCollectionIdentifiers.includes(claseIdentifier)) {
          return false;
        }
        claseCollectionIdentifiers.push(claseIdentifier);
        return true;
      });
      return [...clasesToAdd, ...claseCollection];
    }
    return claseCollection;
  }
}
