import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEstudianteHorario, EstudianteHorario } from '../estudiante-horario.model';

import { EstudianteHorarioService } from './estudiante-horario.service';

describe('EstudianteHorario Service', () => {
  let service: EstudianteHorarioService;
  let httpMock: HttpTestingController;
  let elemDefault: IEstudianteHorario;
  let expectedResult: IEstudianteHorario | IEstudianteHorario[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EstudianteHorarioService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
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

    it('should create a EstudianteHorario', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new EstudianteHorario()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EstudianteHorario', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EstudianteHorario', () => {
      const patchObject = Object.assign({}, new EstudianteHorario());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EstudianteHorario', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should delete a EstudianteHorario', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEstudianteHorarioToCollectionIfMissing', () => {
      it('should add a EstudianteHorario to an empty array', () => {
        const estudianteHorario: IEstudianteHorario = { id: 123 };
        expectedResult = service.addEstudianteHorarioToCollectionIfMissing([], estudianteHorario);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estudianteHorario);
      });

      it('should not add a EstudianteHorario to an array that contains it', () => {
        const estudianteHorario: IEstudianteHorario = { id: 123 };
        const estudianteHorarioCollection: IEstudianteHorario[] = [
          {
            ...estudianteHorario,
          },
          { id: 456 },
        ];
        expectedResult = service.addEstudianteHorarioToCollectionIfMissing(estudianteHorarioCollection, estudianteHorario);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EstudianteHorario to an array that doesn't contain it", () => {
        const estudianteHorario: IEstudianteHorario = { id: 123 };
        const estudianteHorarioCollection: IEstudianteHorario[] = [{ id: 456 }];
        expectedResult = service.addEstudianteHorarioToCollectionIfMissing(estudianteHorarioCollection, estudianteHorario);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estudianteHorario);
      });

      it('should add only unique EstudianteHorario to an array', () => {
        const estudianteHorarioArray: IEstudianteHorario[] = [{ id: 123 }, { id: 456 }, { id: 19400 }];
        const estudianteHorarioCollection: IEstudianteHorario[] = [{ id: 123 }];
        expectedResult = service.addEstudianteHorarioToCollectionIfMissing(estudianteHorarioCollection, ...estudianteHorarioArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const estudianteHorario: IEstudianteHorario = { id: 123 };
        const estudianteHorario2: IEstudianteHorario = { id: 456 };
        expectedResult = service.addEstudianteHorarioToCollectionIfMissing([], estudianteHorario, estudianteHorario2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estudianteHorario);
        expect(expectedResult).toContain(estudianteHorario2);
      });

      it('should accept null and undefined values', () => {
        const estudianteHorario: IEstudianteHorario = { id: 123 };
        expectedResult = service.addEstudianteHorarioToCollectionIfMissing([], null, estudianteHorario, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estudianteHorario);
      });

      it('should return initial array if no EstudianteHorario is added', () => {
        const estudianteHorarioCollection: IEstudianteHorario[] = [{ id: 123 }];
        expectedResult = service.addEstudianteHorarioToCollectionIfMissing(estudianteHorarioCollection, undefined, null);
        expect(expectedResult).toEqual(estudianteHorarioCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
