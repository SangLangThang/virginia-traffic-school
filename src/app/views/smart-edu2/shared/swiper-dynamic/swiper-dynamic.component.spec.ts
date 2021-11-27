import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperDynamicComponent } from './swiper-dynamic.component';

describe('SwiperDynamicComponent', () => {
  let component: SwiperDynamicComponent;
  let fixture: ComponentFixture<SwiperDynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwiperDynamicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwiperDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
