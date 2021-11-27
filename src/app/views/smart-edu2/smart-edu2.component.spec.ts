import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';

import { SmartEdu2Component } from './smart-edu2.component';



describe('SmartEdu2Component', () => {
  let component: SmartEdu2Component;
  let header : HeaderComponent
  let footer : FooterComponent
  let fixture: ComponentFixture<SmartEdu2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmartEdu2Component, MockComponent(HeaderComponent)],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartEdu2Component);
    component = fixture.componentInstance;
    const headerEl = fixture.debugElement.query(
      By.directive(HeaderComponent)
    );
    header = headerEl.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render app-header', () => {
    expect(header).toBeTruthy();
  });
 
});
