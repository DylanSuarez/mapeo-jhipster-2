import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { State } from 'app/entities/enumerations/state.model';
import { IProgramaDeFormacion, ProgramaDeFormacion } from '../programa-de-formacion.model';

import { ProgramaDeFormacionService } from './programa-de-formacion.service';

describe('ProgramaDeFormacion Service', () => {
  let service: ProgramaDeFormacionService;
  let httpMock: HttpTestingController;
  let elemDefault: IProgramaDeFormacion;
  let expectedResult: IProgramaDeFormacion | IProgramaDeFormacion[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProgramaDeFormacionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nombrePrograma: 'AAAAAAA',
      estadoPrograma: State.ACTIVE,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ProgramaDeFormacion', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ProgramaDeFormacion()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProgramaDeFormacion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombrePrograma: 'BBBBBB',
          estadoPrograma: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProgramaDeFormacion', () => {
      const patchObject = Object.assign(
        {
          nombrePrograma: 'BBBBBB',
        },
        new ProgramaDeFormacion()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProgramaDeFormacion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombrePrograma: 'BBBBBB',
          estadoPrograma: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a ProgramaDeFormacion', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProgramaDeFormacionToCollectionIfMissing', () => {
      it('should add a ProgramaDeFormacion to an empty array', () => {
        const programaDeFormacion: IProgramaDeFormacion = { id: 123 };
        expectedResult = service.addProgramaDeFormacionToCollectionIfMissing([], programaDeFormacion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(programaDeFormacion);
      });

      it('should not add a ProgramaDeFormacion to an array that contains it', () => {
        const programaDeFormacion: IProgramaDeFormacion = { id: 123 };
        const programaDeFormacionCollection: IProgramaDeFormacion[] = [
          {
            ...programaDeFormacion,
          },
          { id: 456 },
        ];
        expectedResult = service.addProgramaDeFormacionToCollectionIfMissing(programaDeFormacionCollection, programaDeFormacion);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProgramaDeFormacion to an array that doesn't contain it", () => {
        const programaDeFormacion: IProgramaDeFormacion = { id: 123 };
        const programaDeFormacionCollection: IProgramaDeFormacion[] = [{ id: 456 }];
        expectedResult = service.addProgramaDeFormacionToCollectionIfMissing(programaDeFormacionCollection, programaDeFormacion);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(programaDeFormacion);
      });

      it('should add only unique ProgramaDeFormacion to an array', () => {
        const programaDeFormacionArray: IProgramaDeFormacion[] = [{ id: 123 }, { id: 456 }, { id: 6660 }];
        const programaDeFormacionCollection: IProgramaDeFormacion[] = [{ id: 123 }];
        expectedResult = service.addProgramaDeFormacionToCollectionIfMissing(programaDeFormacionCollection, ...programaDeFormacionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const programaDeFormacion: IProgramaDeFormacion = { id: 123 };
        const programaDeFormacion2: IProgramaDeFormacion = { id: 456 };
        expectedResult = service.addProgramaDeFormacionToCollectionIfMissing([], programaDeFormacion, programaDeFormacion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(programaDeFormacion);
        expect(expectedResult).toContain(programaDeFormacion2);
      });

      it('should accept null and undefined values', () => {
        const programaDeFormacion: IProgramaDeFormacion = { id: 123 };
        expectedResult = service.addProgramaDeFormacionToCollectionIfMissing([], null, programaDeFormacion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(programaDeFormacion);
      });

      it('should return initial array if no ProgramaDeFormacion is added', () => {
        const programaDeFormacionCollection: IProgramaDeFormacion[] = [{ id: 123 }];
        expectedResult = service.addProgramaDeFormacionToCollectionIfMissing(programaDeFormacionCollection, undefined, null);
        expect(expectedResult).toEqual(programaDeFormacionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
