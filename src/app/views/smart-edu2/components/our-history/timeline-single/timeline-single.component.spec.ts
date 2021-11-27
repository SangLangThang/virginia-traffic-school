import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineSingleComponent } from './timeline-single.component';

describe('TimelineSingleComponent', () => {
  let component: TimelineSingleComponent;
  let fixture: ComponentFixture<TimelineSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
