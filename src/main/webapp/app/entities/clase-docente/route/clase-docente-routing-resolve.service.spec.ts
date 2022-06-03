import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IClaseDocente, ClaseDocente } from '../clase-docente.model';
import { ClaseDocenteService } from '../service/clase-docente.service';

import { ClaseDocenteRoutingResolveService } from './clase-docente-routing-resolve.service';

describe('ClaseDocente routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ClaseDocenteRoutingResolveService;
  let service: ClaseDocenteService;
  let resultClaseDocente: IClaseDocente | undefined;

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
    routingResolveService = TestBed.inject(ClaseDocenteRoutingResolveService);
    service = TestBed.inject(ClaseDocenteService);
    resultClaseDocente = undefined;
  });

  describe('resolve', () => {
    it('should return IClaseDocente returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultClaseDocente = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultClaseDocente).toEqual({ id: 123 });
    });

    it('should return new IClaseDocente if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultClaseDocente = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultClaseDocente).toEqual(new ClaseDocente());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ClaseDocente })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultClaseDocente = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultClaseDocente).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
