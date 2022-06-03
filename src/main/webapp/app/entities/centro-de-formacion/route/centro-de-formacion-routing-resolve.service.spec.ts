import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ICentroDeFormacion, CentroDeFormacion } from '../centro-de-formacion.model';
import { CentroDeFormacionService } from '../service/centro-de-formacion.service';

import { CentroDeFormacionRoutingResolveService } from './centro-de-formacion-routing-resolve.service';

describe('CentroDeFormacion routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: CentroDeFormacionRoutingResolveService;
  let service: CentroDeFormacionService;
  let resultCentroDeFormacion: ICentroDeFormacion | undefined;

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
    routingResolveService = TestBed.inject(CentroDeFormacionRoutingResolveService);
    service = TestBed.inject(CentroDeFormacionService);
    resultCentroDeFormacion = undefined;
  });

  describe('resolve', () => {
    it('should return ICentroDeFormacion returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCentroDeFormacion = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCentroDeFormacion).toEqual({ id: 123 });
    });

    it('should return new ICentroDeFormacion if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCentroDeFormacion = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultCentroDeFormacion).toEqual(new CentroDeFormacion());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as CentroDeFormacion })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCentroDeFormacion = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCentroDeFormacion).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
