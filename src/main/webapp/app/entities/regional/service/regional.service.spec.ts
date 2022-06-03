import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRegional, Regional } from '../regional.model';

import { RegionalService } from './regional.service';

describe('Regional Service', () => {
  let service: RegionalService;
  let httpMock: HttpTestingController;
  let elemDefault: IRegional;
  let expectedResult: IRegional | IRegional[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RegionalService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nombreRegional: 'AAAAAAA',
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

    it('should create a Regional', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Regional()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Regional', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombreRegional: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Regional', () => {
      const patchObject = Object.assign(
        {
          nombreRegional: 'BBBBBB',
        },
        new Regional()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Regional', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nombreRegional: 'BBBBBB',
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

    it('should delete a Regional', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addRegionalToCollectionIfMissing', () => {
      it('should add a Regional to an empty array', () => {
        const regional: IRegional = { id: 123 };
        expectedResult = service.addRegionalToCollectionIfMissing([], regional);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(regional);
      });

      it('should not add a Regional to an array that contains it', () => {
        const regional: IRegional = { id: 123 };
        const regionalCollection: IRegional[] = [
          {
            ...regional,
          },
          { id: 456 },
        ];
        expectedResult = service.addRegionalToCollectionIfMissing(regionalCollection, regional);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Regional to an array that doesn't contain it", () => {
        const regional: IRegional = { id: 123 };
        const regionalCollection: IRegional[] = [{ id: 456 }];
        expectedResult = service.addRegionalToCollectionIfMissing(regionalCollection, regional);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(regional);
      });

      it('should add only unique Regional to an array', () => {
        const regionalArray: IRegional[] = [{ id: 123 }, { id: 456 }, { id: 13509 }];
        const regionalCollection: IRegional[] = [{ id: 123 }];
        expectedResult = service.addRegionalToCollectionIfMissing(regionalCollection, ...regionalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const regional: IRegional = { id: 123 };
        const regional2: IRegional = { id: 456 };
        expectedResult = service.addRegionalToCollectionIfMissing([], regional, regional2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(regional);
        expect(expectedResult).toContain(regional2);
      });

      it('should accept null and undefined values', () => {
        const regional: IRegional = { id: 123 };
        expectedResult = service.addRegionalToCollectionIfMissing([], null, regional, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(regional);
      });

      it('should return initial array if no Regional is added', () => {
        const regionalCollection: IRegional[] = [{ id: 123 }];
        expectedResult = service.addRegionalToCollectionIfMissing(regionalCollection, undefined, null);
        expect(expectedResult).toEqual(regionalCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
