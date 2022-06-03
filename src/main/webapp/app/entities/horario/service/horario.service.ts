import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHorario, getHorarioIdentifier } from '../horario.model';

export type EntityResponseType = HttpResponse<IHorario>;
export type EntityArrayResponseType = HttpResponse<IHorario[]>;

@Injectable({ providedIn: 'root' })
export class HorarioService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/horarios');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(horario: IHorario): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(horario);
    return this.http
      .post<IHorario>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(horario: IHorario): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(horario);
    return this.http
      .put<IHorario>(`${this.resourceUrl}/${getHorarioIdentifier(horario) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(horario: IHorario): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(horario);
    return this.http
      .patch<IHorario>(`${this.resourceUrl}/${getHorarioIdentifier(horario) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IHorario>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IHorario[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addHorarioToCollectionIfMissing(horarioCollection: IHorario[], ...horariosToCheck: (IHorario | null | undefined)[]): IHorario[] {
    const horarios: IHorario[] = horariosToCheck.filter(isPresent);
    if (horarios.length > 0) {
      const horarioCollectionIdentifiers = horarioCollection.map(horarioItem => getHorarioIdentifier(horarioItem)!);
      const horariosToAdd = horarios.filter(horarioItem => {
        const horarioIdentifier = getHorarioIdentifier(horarioItem);
        if (horarioIdentifier == null || horarioCollectionIdentifiers.includes(horarioIdentifier)) {
          return false;
        }
        horarioCollectionIdentifiers.push(horarioIdentifier);
        return true;
      });
      return [...horariosToAdd, ...horarioCollection];
    }
    return horarioCollection;
  }

  protected convertDateFromClient(horario: IHorario): IHorario {
    return Object.assign({}, horario, {
      horaInicio: horario.horaInicio?.isValid() ? horario.horaInicio.toJSON() : undefined,
      horaFinal: horario.horaFinal?.isValid() ? horario.horaFinal.toJSON() : undefined,
      fecha: horario.fecha?.isValid() ? horario.fecha.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.horaInicio = res.body.horaInicio ? dayjs(res.body.horaInicio) : undefined;
      res.body.horaFinal = res.body.horaFinal ? dayjs(res.body.horaFinal) : undefined;
      res.body.fecha = res.body.fecha ? dayjs(res.body.fecha) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((horario: IHorario) => {
        horario.horaInicio = horario.horaInicio ? dayjs(horario.horaInicio) : undefined;
        horario.horaFinal = horario.horaFinal ? dayjs(horario.horaFinal) : undefined;
        horario.fecha = horario.fecha ? dayjs(horario.fecha) : undefined;
      });
    }
    return res;
  }
}
