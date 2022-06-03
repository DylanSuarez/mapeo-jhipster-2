import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IClaseProgramaDeFormacion, ClaseProgramaDeFormacion } from '../clase-programa-de-formacion.model';

import { ClaseProgramaDeFormacionService } from './clase-programa-de-formacion.service';

describe('ClaseProgramaDeFormacion Service', () => {
  let service: ClaseProgramaDeFormacionService;
  let httpMock: HttpTestingController;
  let elemDefault: IClaseProgramaDeFormacion;
  let expectedResult: IClaseProgramaDeFormacion | IClaseProgramaDeFormacion[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ClaseProgramaDeFormacionService);
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

    it('should create a ClaseProgramaDeFormacion', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ClaseProgramaDeFormacion()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ClaseProgramaDeFormacion', () => {
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

    it('should partial update a ClaseProgramaDeFormacion', () => {
      const patchObject = Object.assign({}, new ClaseProgramaDeFormacion());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ClaseProgramaDeFormacion', () => {
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

    it('should delete a ClaseProgramaDeFormacion', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addClaseProgramaDeFormacionToCollectionIfMissing', () => {
      it('should add a ClaseProgramaDeFormacion to an empty array', () => {
        const claseProgramaDeFormacion: IClaseProgramaDeFormacion = { id: 123 };
        expectedResult = service.addClaseProgramaDeFormacionToCollectionIfMissing([], claseProgramaDeFormacion);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(claseProgramaDeFormacion);
      });

      it('should not add a ClaseProgramaDeFormacion to an array that contains it', () => {
        const claseProgramaDeFormacion: IClaseProgramaDeFormacion = { id: 123 };
        const claseProgramaDeFormacionCollection: IClaseProgramaDeFormacion[] = [
          {
            ...claseProgramaDeFormacion,
          },
          { id: 456 },
        ];
        expectedResult = service.addClaseProgramaDeFormacionToCollectionIfMissing(
          claseProgramaDeFormacionCollection,
          claseProgramaDeFormacion
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ClaseProgramaDeFormacion to an array that doesn't contain it", () => {
        const claseProgramaDeFormacion: IClaseProgramaDeFormacion = { id: 123 };
        const claseProgramaDeFormacionCollection: IClaseProgramaDeFormacion[] = [{ id: 456 }];
        expectedResult = service.addClaseProgramaDeFormacionToCollectionIfMissing(
          claseProgramaDeFormacionCollection,
          claseProgramaDeFormacion
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(claseProgramaDeFormacion);
      });

      it('should add only unique ClaseProgramaDeFormacion to an array', () => {
        const claseProgramaDeFormacionArray: IClaseProgramaDeFormacion[] = [{ id: 123 }, { id: 456 }, { id: 66711 }];
        const claseProgramaDeFormacionCollection: IClaseProgramaDeFormacion[] = [{ id: 123 }];
        expectedResult = service.addClaseProgramaDeFormacionToCollectionIfMissing(
          claseProgramaDeFormacionCollection,
          ...claseProgramaDeFormacionArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const claseProgramaDeFormacion: IClaseProgramaDeFormacion = { id: 123 };
        const claseProgramaDeFormacion2: IClaseProgramaDeFormacion = { id: 456 };
        expectedResult = service.addClaseProgramaDeFormacionToCollectionIfMissing([], claseProgramaDeFormacion, claseProgramaDeFormacion2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(claseProgramaDeFormacion);
        expect(expectedResult).toContain(claseProgramaDeFormacion2);
      });

      it('should accept null and undefined values', () => {
        const claseProgramaDeFormacion: IClaseProgramaDeFormacion = { id: 123 };
        expectedResult = service.addClaseProgramaDeFormacionToCollectionIfMissing([], null, claseProgramaDeFormacion, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(claseProgramaDeFormacion);
      });

      it('should return initial array if no ClaseProgramaDeFormacion is added', () => {
        const claseProgramaDeFormacionCollection: IClaseProgramaDeFormacion[] = [{ id: 123 }];
        expectedResult = service.addClaseProgramaDeFormacionToCollectionIfMissing(claseProgramaDeFormacionCollection, undefined, null);
        expect(expectedResult).toEqual(claseProgramaDeFormacionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
