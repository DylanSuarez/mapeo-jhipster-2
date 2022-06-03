import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProgramaDeFormacion, getProgramaDeFormacionIdentifier } from '../programa-de-formacion.model';

export type EntityResponseType = HttpResponse<IProgramaDeFormacion>;
export type EntityArrayResponseType = HttpResponse<IProgramaDeFormacion[]>;

@Injectable({ providedIn: 'root' })
export class ProgramaDeFormacionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/programa-de-formacions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(programaDeFormacion: IProgramaDeFormacion): Observable<EntityResponseType> {
    return this.http.post<IProgramaDeFormacion>(this.resourceUrl, programaDeFormacion, { observe: 'response' });
  }

  update(programaDeFormacion: IProgramaDeFormacion): Observable<EntityResponseType> {
    return this.http.put<IProgramaDeFormacion>(
      `${this.resourceUrl}/${getProgramaDeFormacionIdentifier(programaDeFormacion) as number}`,
      programaDeFormacion,
      { observe: 'response' }
    );
  }

  partialUpdate(programaDeFormacion: IProgramaDeFormacion): Observable<EntityResponseType> {
    return this.http.patch<IProgramaDeFormacion>(
      `${this.resourceUrl}/${getProgramaDeFormacionIdentifier(programaDeFormacion) as number}`,
      programaDeFormacion,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProgramaDeFormacion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProgramaDeFormacion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProgramaDeFormacionToCollectionIfMissing(
    programaDeFormacionCollection: IProgramaDeFormacion[],
    ...programaDeFormacionsToCheck: (IProgramaDeFormacion | null | undefined)[]
  ): IProgramaDeFormacion[] {
    const programaDeFormacions: IProgramaDeFormacion[] = programaDeFormacionsToCheck.filter(isPresent);
    if (programaDeFormacions.length > 0) {
      const programaDeFormacionCollectionIdentifiers = programaDeFormacionCollection.map(
        programaDeFormacionItem => getProgramaDeFormacionIdentifier(programaDeFormacionItem)!
      );
      const programaDeFormacionsToAdd = programaDeFormacions.filter(programaDeFormacionItem => {
        const programaDeFormacionIdentifier = getProgramaDeFormacionIdentifier(programaDeFormacionItem);
        if (programaDeFormacionIdentifier == null || programaDeFormacionCollectionIdentifiers.includes(programaDeFormacionIdentifier)) {
          return false;
        }
        programaDeFormacionCollectionIdentifiers.push(programaDeFormacionIdentifier);
        return true;
      });
      return [...programaDeFormacionsToAdd, ...programaDeFormacionCollection];
    }
    return programaDeFormacionCollection;
  }
}
