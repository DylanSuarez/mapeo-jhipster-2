import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IClaseProgramaDeFormacion, ClaseProgramaDeFormacion } from '../clase-programa-de-formacion.model';
import { ClaseProgramaDeFormacionService } from '../service/clase-programa-de-formacion.service';

import { ClaseProgramaDeFormacionRoutingResolveService } from './clase-programa-de-formacion-routing-resolve.service';

describe('ClaseProgramaDeFormacion routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ClaseProgramaDeFormacionRoutingResolveService;
  let service: ClaseProgramaDeFormacionService;
  let resultClaseProgramaDeFormacion: IClaseProgramaDeFormacion | undefined;

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
    routingResolveService = TestBed.inject(ClaseProgramaDeFormacionRoutingResolveService);
    service = TestBed.inject(ClaseProgramaDeFormacionService);
    resultClaseProgramaDeFormacion = undefined;
  });

  describe('resolve', () => {
    it('should return IClaseProgramaDeFormacion returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultClaseProgramaDeFormacion = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultClaseProgramaDeFormacion).toEqual({ id: 123 });
    });

    it('should return new IClaseProgramaDeFormacion if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultClaseProgramaDeFormacion = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultClaseProgramaDeFormacion).toEqual(new ClaseProgramaDeFormacion());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ClaseProgramaDeFormacion })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultClaseProgramaDeFormacion = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultClaseProgramaDeFormacion).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
