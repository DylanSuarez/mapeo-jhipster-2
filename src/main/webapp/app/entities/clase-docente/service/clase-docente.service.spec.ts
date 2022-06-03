import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IClaseDocente, ClaseDocente } from '../clase-docente.model';

import { ClaseDocenteService } from './clase-docente.service';

describe('ClaseDocente Service', () => {
  let service: ClaseDocenteService;
  let httpMock: HttpTestingController;
  let elemDefault: IClaseDocente;
  let expectedResult: IClaseDocente | IClaseDocente[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ClaseDocenteService);
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

    it('should create a ClaseDocente', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ClaseDocente()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ClaseDocente', () => {
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

    it('should partial update a ClaseDocente', () => {
      const patchObject = Object.assign({}, new ClaseDocente());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ClaseDocente', () => {
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

    it('should delete a ClaseDocente', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addClaseDocenteToCollectionIfMissing', () => {
      it('should add a ClaseDocente to an empty array', () => {
        const claseDocente: IClaseDocente = { id: 123 };
        expectedResult = service.addClaseDocenteToCollectionIfMissing([], claseDocente);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(claseDocente);
      });

      it('should not add a ClaseDocente to an array that contains it', () => {
        const claseDocente: IClaseDocente = { id: 123 };
        const claseDocenteCollection: IClaseDocente[] = [
          {
            ...claseDocente,
          },
          { id: 456 },
        ];
        expectedResult = service.addClaseDocenteToCollectionIfMissing(claseDocenteCollection, claseDocente);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ClaseDocente to an array that doesn't contain it", () => {
        const claseDocente: IClaseDocente = { id: 123 };
        const claseDocenteCollection: IClaseDocente[] = [{ id: 456 }];
        expectedResult = service.addClaseDocenteToCollectionIfMissing(claseDocenteCollection, claseDocente);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(claseDocente);
      });

      it('should add only unique ClaseDocente to an array', () => {
        const claseDocenteArray: IClaseDocente[] = [{ id: 123 }, { id: 456 }, { id: 82848 }];
        const claseDocenteCollection: IClaseDocente[] = [{ id: 123 }];
        expectedResult = service.addClaseDocenteToCollectionIfMissing(claseDocenteCollection, ...claseDocenteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const claseDocente: IClaseDocente = { id: 123 };
        const claseDocente2: IClaseDocente = { id: 456 };
        expectedResult = service.addClaseDocenteToCollectionIfMissing([], claseDocente, claseDocente2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(claseDocente);
        expect(expectedResult).toContain(claseDocente2);
      });

      it('should accept null and undefined values', () => {
        const claseDocente: IClaseDocente = { id: 123 };
        expectedResult = service.addClaseDocenteToCollectionIfMissing([], null, claseDocente, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(claseDocente);
      });

      it('should return initial array if no ClaseDocente is added', () => {
        const claseDocenteCollection: IClaseDocente[] = [{ id: 123 }];
        expectedResult = service.addClaseDocenteToCollectionIfMissing(claseDocenteCollection, undefined, null);
        expect(expectedResult).toEqual(claseDocenteCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
