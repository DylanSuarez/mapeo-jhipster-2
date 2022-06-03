import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITrimestre, Trimestre } from '../trimestre.model';

import { TrimestreService } from './trimestre.service';

describe('Trimestre Service', () => {
  let service: TrimestreService;
  let httpMock: HttpTestingController;
  let elemDefault: ITrimestre;
  let expectedResult: ITrimestre | ITrimestre[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TrimestreService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      numTrimestre: 'AAAAAAA',
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

    it('should create a Trimestre', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Trimestre()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Trimestre', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numTrimestre: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Trimestre', () => {
      const patchObject = Object.assign(
        {
          numTrimestre: 'BBBBBB',
        },
        new Trimestre()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Trimestre', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numTrimestre: 'BBBBBB',
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

    it('should delete a Trimestre', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTrimestreToCollectionIfMissing', () => {
      it('should add a Trimestre to an empty array', () => {
        const trimestre: ITrimestre = { id: 123 };
        expectedResult = service.addTrimestreToCollectionIfMissing([], trimestre);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(trimestre);
      });

      it('should not add a Trimestre to an array that contains it', () => {
        const trimestre: ITrimestre = { id: 123 };
        const trimestreCollection: ITrimestre[] = [
          {
            ...trimestre,
          },
          { id: 456 },
        ];
        expectedResult = service.addTrimestreToCollectionIfMissing(trimestreCollection, trimestre);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Trimestre to an array that doesn't contain it", () => {
        const trimestre: ITrimestre = { id: 123 };
        const trimestreCollection: ITrimestre[] = [{ id: 456 }];
        expectedResult = service.addTrimestreToCollectionIfMissing(trimestreCollection, trimestre);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(trimestre);
      });

      it('should add only unique Trimestre to an array', () => {
        const trimestreArray: ITrimestre[] = [{ id: 123 }, { id: 456 }, { id: 25316 }];
        const trimestreCollection: ITrimestre[] = [{ id: 123 }];
        expectedResult = service.addTrimestreToCollectionIfMissing(trimestreCollection, ...trimestreArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const trimestre: ITrimestre = { id: 123 };
        const trimestre2: ITrimestre = { id: 456 };
        expectedResult = service.addTrimestreToCollectionIfMissing([], trimestre, trimestre2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(trimestre);
        expect(expectedResult).toContain(trimestre2);
      });

      it('should accept null and undefined values', () => {
        const trimestre: ITrimestre = { id: 123 };
        expectedResult = service.addTrimestreToCollectionIfMissing([], null, trimestre, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(trimestre);
      });

      it('should return initial array if no Trimestre is added', () => {
        const trimestreCollection: ITrimestre[] = [{ id: 123 }];
        expectedResult = service.addTrimestreToCollectionIfMissing(trimestreCollection, undefined, null);
        expect(expectedResult).toEqual(trimestreCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
