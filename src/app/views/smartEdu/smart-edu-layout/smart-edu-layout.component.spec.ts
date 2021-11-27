import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartEduLayoutComponent } from './smart-edu-layout.component';

describe('SmartEduLayoutComponent', () => {
  let component: SmartEduLayoutComponent;
  let fixture: ComponentFixture<SmartEduLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartEduLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartEduLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
