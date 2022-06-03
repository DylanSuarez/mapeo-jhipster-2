import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IClaseProgramaDeFormacion, getClaseProgramaDeFormacionIdentifier } from '../clase-programa-de-formacion.model';

export type EntityResponseType = HttpResponse<IClaseProgramaDeFormacion>;
export type EntityArrayResponseType = HttpResponse<IClaseProgramaDeFormacion[]>;

@Injectable({ providedIn: 'root' })
export class ClaseProgramaDeFormacionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/clase-programa-de-formacions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(claseProgramaDeFormacion: IClaseProgramaDeFormacion): Observable<EntityResponseType> {
    return this.http.post<IClaseProgramaDeFormacion>(this.resourceUrl, claseProgramaDeFormacion, { observe: 'response' });
  }

  update(claseProgramaDeFormacion: IClaseProgramaDeFormacion): Observable<EntityResponseType> {
    return this.http.put<IClaseProgramaDeFormacion>(
      `${this.resourceUrl}/${getClaseProgramaDeFormacionIdentifier(claseProgramaDeFormacion) as number}`,
      claseProgramaDeFormacion,
      { observe: 'response' }
    );
  }

  partialUpdate(claseProgramaDeFormacion: IClaseProgramaDeFormacion): Observable<EntityResponseType> {
    return this.http.patch<IClaseProgramaDeFormacion>(
      `${this.resourceUrl}/${getClaseProgramaDeFormacionIdentifier(claseProgramaDeFormacion) as number}`,
      claseProgramaDeFormacion,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IClaseProgramaDeFormacion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IClaseProgramaDeFormacion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addClaseProgramaDeFormacionToCollectionIfMissing(
    claseProgramaDeFormacionCollection: IClaseProgramaDeFormacion[],
    ...claseProgramaDeFormacionsToCheck: (IClaseProgramaDeFormacion | null | undefined)[]
  ): IClaseProgramaDeFormacion[] {
    const claseProgramaDeFormacions: IClaseProgramaDeFormacion[] = claseProgramaDeFormacionsToCheck.filter(isPresent);
    if (claseProgramaDeFormacions.length > 0) {
      const claseProgramaDeFormacionCollectionIdentifiers = claseProgramaDeFormacionCollection.map(
        claseProgramaDeFormacionItem => getClaseProgramaDeFormacionIdentifier(claseProgramaDeFormacionItem)!
      );
      const claseProgramaDeFormacionsToAdd = claseProgramaDeFormacions.filter(claseProgramaDeFormacionItem => {
        const claseProgramaDeFormacionIdentifier = getClaseProgramaDeFormacionIdentifier(claseProgramaDeFormacionItem);
        if (
          claseProgramaDeFormacionIdentifier == null ||
          claseProgramaDeFormacionCollectionIdentifiers.includes(claseProgramaDeFormacionIdentifier)
        ) {
          return false;
        }
        claseProgramaDeFormacionCollectionIdentifiers.push(claseProgramaDeFormacionIdentifier);
        return true;
      });
      return [...claseProgramaDeFormacionsToAdd, ...claseProgramaDeFormacionCollection];
    }
    return claseProgramaDeFormacionCollection;
  }
}
