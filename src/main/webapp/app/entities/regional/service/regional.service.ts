import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRegional, getRegionalIdentifier } from '../regional.model';

export type EntityResponseType = HttpResponse<IRegional>;
export type EntityArrayResponseType = HttpResponse<IRegional[]>;

@Injectable({ providedIn: 'root' })
export class RegionalService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/regionals');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(regional: IRegional): Observable<EntityResponseType> {
    return this.http.post<IRegional>(this.resourceUrl, regional, { observe: 'response' });
  }

  update(regional: IRegional): Observable<EntityResponseType> {
    return this.http.put<IRegional>(`${this.resourceUrl}/${getRegionalIdentifier(regional) as number}`, regional, { observe: 'response' });
  }

  partialUpdate(regional: IRegional): Observable<EntityResponseType> {
    return this.http.patch<IRegional>(`${this.resourceUrl}/${getRegionalIdentifier(regional) as number}`, regional, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRegional>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRegional[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRegionalToCollectionIfMissing(regionalCollection: IRegional[], ...regionalsToCheck: (IRegional | null | undefined)[]): IRegional[] {
    const regionals: IRegional[] = regionalsToCheck.filter(isPresent);
    if (regionals.length > 0) {
      const regionalCollectionIdentifiers = regionalCollection.map(regionalItem => getRegionalIdentifier(regionalItem)!);
      const regionalsToAdd = regionals.filter(regionalItem => {
        const regionalIdentifier = getRegionalIdentifier(regionalItem);
        if (regionalIdentifier == null || regionalCollectionIdentifiers.includes(regionalIdentifier)) {
          return false;
        }
        regionalCollectionIdentifiers.push(regionalIdentifier);
        return true;
      });
      return [...regionalsToAdd, ...regionalCollection];
    }
    return regionalCollection;
  }
}
