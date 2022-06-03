import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { State } from 'app/entities/enumerations/state.model';
import { IFicha, Ficha } from '../ficha.model';

import { FichaService } from './ficha.service';

describe('Ficha Service', () => {
  let service: FichaService;
  let httpMock: HttpTestingController;
  let elemDefault: IFicha;
  let expectedResult: IFicha | IFicha[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FichaService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nombreFicha: 'AAAAAAA',
      estadoFicha: State.ACTIVE,
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

    it('should create a Ficha', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Ficha()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Ficha', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombreFicha: 'BBBBBB',
          estadoFicha: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Ficha', () => {
      const patchObject = Object.assign(
        {
          estadoFicha: 'BBBBBB',
        },
        new Ficha()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Ficha', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombreFicha: 'BBBBBB',
          estadoFicha: 'BBBBBB',
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

    it('should delete a Ficha', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFichaToCollectionIfMissing', () => {
      it('should add a Ficha to an empty array', () => {
        const ficha: IFicha = { id: 123 };
        expectedResult = service.addFichaToCollectionIfMissing([], ficha);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ficha);
      });

      it('should not add a Ficha to an array that contains it', () => {
        const ficha: IFicha = { id: 123 };
        const fichaCollection: IFicha[] = [
          {
            ...ficha,
          },
          { id: 456 },
        ];
        expectedResult = service.addFichaToCollectionIfMissing(fichaCollection, ficha);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Ficha to an array that doesn't contain it", () => {
        const ficha: IFicha = { id: 123 };
        const fichaCollection: IFicha[] = [{ id: 456 }];
        expectedResult = service.addFichaToCollectionIfMissing(fichaCollection, ficha);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ficha);
      });

      it('should add only unique Ficha to an array', () => {
        const fichaArray: IFicha[] = [{ id: 123 }, { id: 456 }, { id: 37027 }];
        const fichaCollection: IFicha[] = [{ id: 123 }];
        expectedResult = service.addFichaToCollectionIfMissing(fichaCollection, ...fichaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ficha: IFicha = { id: 123 };
        const ficha2: IFicha = { id: 456 };
        expectedResult = service.addFichaToCollectionIfMissing([], ficha, ficha2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ficha);
        expect(expectedResult).toContain(ficha2);
      });

      it('should accept null and undefined values', () => {
        const ficha: IFicha = { id: 123 };
        expectedResult = service.addFichaToCollectionIfMissing([], null, ficha, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ficha);
      });

      it('should return initial array if no Ficha is added', () => {
        const fichaCollection: IFicha[] = [{ id: 123 }];
        expectedResult = service.addFichaToCollectionIfMissing(fichaCollection, undefined, null);
        expect(expectedResult).toEqual(fichaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
