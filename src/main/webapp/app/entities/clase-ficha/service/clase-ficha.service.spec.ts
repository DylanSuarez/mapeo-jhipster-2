import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IClaseFicha, ClaseFicha } from '../clase-ficha.model';

import { ClaseFichaService } from './clase-ficha.service';

describe('ClaseFicha Service', () => {
  let service: ClaseFichaService;
  let httpMock: HttpTestingController;
  let elemDefault: IClaseFicha;
  let expectedResult: IClaseFicha | IClaseFicha[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ClaseFichaService);
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

    it('should create a ClaseFicha', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ClaseFicha()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ClaseFicha', () => {
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

    it('should partial update a ClaseFicha', () => {
      const patchObject = Object.assign({}, new ClaseFicha());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ClaseFicha', () => {
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

    it('should delete a ClaseFicha', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addClaseFichaToCollectionIfMissing', () => {
      it('should add a ClaseFicha to an empty array', () => {
        const claseFicha: IClaseFicha = { id: 123 };
        expectedResult = service.addClaseFichaToCollectionIfMissing([], claseFicha);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(claseFicha);
      });

      it('should not add a ClaseFicha to an array that contains it', () => {
        const claseFicha: IClaseFicha = { id: 123 };
        const claseFichaCollection: IClaseFicha[] = [
          {
            ...claseFicha,
          },
          { id: 456 },
        ];
        expectedResult = service.addClaseFichaToCollectionIfMissing(claseFichaCollection, claseFicha);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ClaseFicha to an array that doesn't contain it", () => {
        const claseFicha: IClaseFicha = { id: 123 };
        const claseFichaCollection: IClaseFicha[] = [{ id: 456 }];
        expectedResult = service.addClaseFichaToCollectionIfMissing(claseFichaCollection, claseFicha);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(claseFicha);
      });

      it('should add only unique ClaseFicha to an array', () => {
        const claseFichaArray: IClaseFicha[] = [{ id: 123 }, { id: 456 }, { id: 23744 }];
        const claseFichaCollection: IClaseFicha[] = [{ id: 123 }];
        expectedResult = service.addClaseFichaToCollectionIfMissing(claseFichaCollection, ...claseFichaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const claseFicha: IClaseFicha = { id: 123 };
        const claseFicha2: IClaseFicha = { id: 456 };
        expectedResult = service.addClaseFichaToCollectionIfMissing([], claseFicha, claseFicha2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(claseFicha);
        expect(expectedResult).toContain(claseFicha2);
      });

      it('should accept null and undefined values', () => {
        const claseFicha: IClaseFicha = { id: 123 };
        expectedResult = service.addClaseFichaToCollectionIfMissing([], null, claseFicha, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(claseFicha);
      });

      it('should return initial array if no ClaseFicha is added', () => {
        const claseFichaCollection: IClaseFicha[] = [{ id: 123 }];
        expectedResult = service.addClaseFichaToCollectionIfMissing(claseFichaCollection, undefined, null);
        expect(expectedResult).toEqual(claseFichaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
