import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICentroDeFormacion, CentroDeFormacion } from '../centro-de-formacion.model';

import { CentroDeFormacionService } from './centro-de-formacion.service';

describe('CentroDeFormacion Service', () => {
  let service: CentroDeFormacionService;
  let httpMock: HttpTestingController;
  let elemDefault: ICentroDeFormacion;
  let expectedResult: ICentroDeFormacion | ICentroDeFormacion[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CentroDeFormacionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nombreCentro: 'AAAAAAA',
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

    it('should create a CentroDeFormacion', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new CentroDeFormacion()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CentroDeFormacion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombreCentro: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CentroDeFormacion', () => {
      const patchObject = Object.assign({}, new CentroDeFormacion());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CentroDeFormacion', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombreCentro: 'BBBBBB',
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

    it('should delete a CentroDeFormacion', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCentroDeFormacionToCollectionIfMissing', () => {
      it('should add a CentroDeFormacion to an empty array', () => {
        const centroDeFormacion: ICentroDeFormacion = { id: 123 };
        expectedResult = service.addCentroDeFormacionToCollectionIfMissing([], centroDeFormacion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(centroDeFormacion);
      });

      it('should not add a CentroDeFormacion to an array that contains it', () => {
        const centroDeFormacion: ICentroDeFormacion = { id: 123 };
        const centroDeFormacionCollection: ICentroDeFormacion[] = [
          {
            ...centroDeFormacion,
          },
          { id: 456 },
        ];
        expectedResult = service.addCentroDeFormacionToCollectionIfMissing(centroDeFormacionCollection, centroDeFormacion);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CentroDeFormacion to an array that doesn't contain it", () => {
        const centroDeFormacion: ICentroDeFormacion = { id: 123 };
        const centroDeFormacionCollection: ICentroDeFormacion[] = [{ id: 456 }];
        expectedResult = service.addCentroDeFormacionToCollectionIfMissing(centroDeFormacionCollection, centroDeFormacion);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(centroDeFormacion);
      });

      it('should add only unique CentroDeFormacion to an array', () => {
        const centroDeFormacionArray: ICentroDeFormacion[] = [{ id: 123 }, { id: 456 }, { id: 26084 }];
        const centroDeFormacionCollection: ICentroDeFormacion[] = [{ id: 123 }];
        expectedResult = service.addCentroDeFormacionToCollectionIfMissing(centroDeFormacionCollection, ...centroDeFormacionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const centroDeFormacion: ICentroDeFormacion = { id: 123 };
        const centroDeFormacion2: ICentroDeFormacion = { id: 456 };
        expectedResult = service.addCentroDeFormacionToCollectionIfMissing([], centroDeFormacion, centroDeFormacion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(centroDeFormacion);
        expect(expectedResult).toContain(centroDeFormacion2);
      });

      it('should accept null and undefined values', () => {
        const centroDeFormacion: ICentroDeFormacion = { id: 123 };
        expectedResult = service.addCentroDeFormacionToCollectionIfMissing([], null, centroDeFormacion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(centroDeFormacion);
      });

      it('should return initial array if no CentroDeFormacion is added', () => {
        const centroDeFormacionCollection: ICentroDeFormacion[] = [{ id: 123 }];
        expectedResult = service.addCentroDeFormacionToCollectionIfMissing(centroDeFormacionCollection, undefined, null);
        expect(expectedResult).toEqual(centroDeFormacionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
