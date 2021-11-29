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
  it('should change plan month to year', () => {
    let actualData = []
    service.pricingFeaturesChange.subscribe(data=>{
      actualData = data
    })
    service.changePricingFeatures('year')
    expect(actualData[0].time).toBe('year')
  });
  it('should change plan year to month', () => {
    let actualData = []
    service.pricingFeaturesChange.subscribe(data=>{
      actualData = data
    })
    service.changePricingFeatures('month')
    expect(actualData[0].time).toBe('per month')
  });
});
