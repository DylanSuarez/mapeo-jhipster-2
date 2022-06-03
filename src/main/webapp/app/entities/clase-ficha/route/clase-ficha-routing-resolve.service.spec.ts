import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IClaseFicha, ClaseFicha } from '../clase-ficha.model';
import { ClaseFichaService } from '../service/clase-ficha.service';

import { ClaseFichaRoutingResolveService } from './clase-ficha-routing-resolve.service';

describe('ClaseFicha routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ClaseFichaRoutingResolveService;
  let service: ClaseFichaService;
  let resultClaseFicha: IClaseFicha | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(ClaseFichaRoutingResolveService);
    service = TestBed.inject(ClaseFichaService);
    resultClaseFicha = undefined;
  });

  describe('resolve', () => {
    it('should return IClaseFicha returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultClaseFicha = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultClaseFicha).toEqual({ id: 123 });
    });

    it('should return new IClaseFicha if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultClaseFicha = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultClaseFicha).toEqual(new ClaseFicha());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ClaseFicha })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultClaseFicha = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultClaseFicha).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
