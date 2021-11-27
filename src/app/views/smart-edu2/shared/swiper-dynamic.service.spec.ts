import { TestBed } from '@angular/core/testing';

import { SwiperDynamicService } from './swiper-dynamic.service';

describe('SwiperDynamicService', () => {
  let service: SwiperDynamicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwiperDynamicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
