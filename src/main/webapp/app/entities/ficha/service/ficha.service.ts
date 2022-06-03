import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFicha, getFichaIdentifier } from '../ficha.model';

export type EntityResponseType = HttpResponse<IFicha>;
export type EntityArrayResponseType = HttpResponse<IFicha[]>;

@Injectable({ providedIn: 'root' })
export class FichaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fichas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ficha: IFicha): Observable<EntityResponseType> {
    return this.http.post<IFicha>(this.resourceUrl, ficha, { observe: 'response' });
  }

  update(ficha: IFicha): Observable<EntityResponseType> {
    return this.http.put<IFicha>(`${this.resourceUrl}/${getFichaIdentifier(ficha) as number}`, ficha, { observe: 'response' });
  }

  partialUpdate(ficha: IFicha): Observable<EntityResponseType> {
    return this.http.patch<IFicha>(`${this.resourceUrl}/${getFichaIdentifier(ficha) as number}`, ficha, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFicha>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFicha[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFichaToCollectionIfMissing(fichaCollection: IFicha[], ...fichasToCheck: (IFicha | null | undefined)[]): IFicha[] {
    const fichas: IFicha[] = fichasToCheck.filter(isPresent);
    if (fichas.length > 0) {
      const fichaCollectionIdentifiers = fichaCollection.map(fichaItem => getFichaIdentifier(fichaItem)!);
      const fichasToAdd = fichas.filter(fichaItem => {
        const fichaIdentifier = getFichaIdentifier(fichaItem);
        if (fichaIdentifier == null || fichaCollectionIdentifiers.includes(fichaIdentifier)) {
          return false;
        }
        fichaCollectionIdentifiers.push(fichaIdentifier);
        return true;
      });
      return [...fichasToAdd, ...fichaCollection];
    }
    return fichaCollection;
  }
}
