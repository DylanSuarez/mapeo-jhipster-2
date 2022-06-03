import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IClase, Clase } from '../clase.model';

import { ClaseService } from './clase.service';

describe('Clase Service', () => {
  let service: ClaseService;
  let httpMock: HttpTestingController;
  let elemDefault: IClase;
  let expectedResult: IClase | IClase[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ClaseService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nombreClase: 'AAAAAAA',
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

    it('should create a Clase', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Clase()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Clase', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombreClase: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Clase', () => {
      const patchObject = Object.assign({}, new Clase());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Clase', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombreClase: 'BBBBBB',
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

    it('should delete a Clase', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addClaseToCollectionIfMissing', () => {
      it('should add a Clase to an empty array', () => {
        const clase: IClase = { id: 123 };
        expectedResult = service.addClaseToCollectionIfMissing([], clase);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clase);
      });

      it('should not add a Clase to an array that contains it', () => {
        const clase: IClase = { id: 123 };
        const claseCollection: IClase[] = [
          {
            ...clase,
          },
          { id: 456 },
        ];
        expectedResult = service.addClaseToCollectionIfMissing(claseCollection, clase);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Clase to an array that doesn't contain it", () => {
        const clase: IClase = { id: 123 };
        const claseCollection: IClase[] = [{ id: 456 }];
        expectedResult = service.addClaseToCollectionIfMissing(claseCollection, clase);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clase);
      });

      it('should add only unique Clase to an array', () => {
        const claseArray: IClase[] = [{ id: 123 }, { id: 456 }, { id: 46860 }];
        const claseCollection: IClase[] = [{ id: 123 }];
        expectedResult = service.addClaseToCollectionIfMissing(claseCollection, ...claseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const clase: IClase = { id: 123 };
        const clase2: IClase = { id: 456 };
        expectedResult = service.addClaseToCollectionIfMissing([], clase, clase2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clase);
        expect(expectedResult).toContain(clase2);
      });

      it('should accept null and undefined values', () => {
        const clase: IClase = { id: 123 };
        expectedResult = service.addClaseToCollectionIfMissing([], null, clase, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clase);
      });

      it('should return initial array if no Clase is added', () => {
        const claseCollection: IClase[] = [{ id: 123 }];
        expectedResult = service.addClaseToCollectionIfMissing(claseCollection, undefined, null);
        expect(expectedResult).toEqual(claseCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
