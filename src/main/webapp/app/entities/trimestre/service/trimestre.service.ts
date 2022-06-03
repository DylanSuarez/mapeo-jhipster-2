import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITrimestre, getTrimestreIdentifier } from '../trimestre.model';

export type EntityResponseType = HttpResponse<ITrimestre>;
export type EntityArrayResponseType = HttpResponse<ITrimestre[]>;

@Injectable({ providedIn: 'root' })
export class TrimestreService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/trimestres');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(trimestre: ITrimestre): Observable<EntityResponseType> {
    return this.http.post<ITrimestre>(this.resourceUrl, trimestre, { observe: 'response' });
  }

  update(trimestre: ITrimestre): Observable<EntityResponseType> {
    return this.http.put<ITrimestre>(`${this.resourceUrl}/${getTrimestreIdentifier(trimestre) as number}`, trimestre, {
      observe: 'response',
    });
  }

  partialUpdate(trimestre: ITrimestre): Observable<EntityResponseType> {
    return this.http.patch<ITrimestre>(`${this.resourceUrl}/${getTrimestreIdentifier(trimestre) as number}`, trimestre, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITrimestre>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITrimestre[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTrimestreToCollectionIfMissing(
    trimestreCollection: ITrimestre[],
    ...trimestresToCheck: (ITrimestre | null | undefined)[]
  ): ITrimestre[] {
    const trimestres: ITrimestre[] = trimestresToCheck.filter(isPresent);
    if (trimestres.length > 0) {
      const trimestreCollectionIdentifiers = trimestreCollection.map(trimestreItem => getTrimestreIdentifier(trimestreItem)!);
      const trimestresToAdd = trimestres.filter(trimestreItem => {
        const trimestreIdentifier = getTrimestreIdentifier(trimestreItem);
        if (trimestreIdentifier == null || trimestreCollectionIdentifiers.includes(trimestreIdentifier)) {
          return false;
        }
        trimestreCollectionIdentifiers.push(trimestreIdentifier);
        return true;
      });
      return [...trimestresToAdd, ...trimestreCollection];
    }
    return trimestreCollection;
  }
}
