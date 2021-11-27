import { TestBed } from '@angular/core/testing';

import { PlanServicesService } from './plan-services.service';

describe('PlanServicesService', () => {
  let service: PlanServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
