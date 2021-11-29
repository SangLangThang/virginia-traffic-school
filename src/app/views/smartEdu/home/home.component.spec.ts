import { ComponentFixture, TestBed } from "@angular/core/testing";
import { findEls, makeClickEvent } from "../../../testing/element.spec-helper";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should toggle panel when click btn", () => {
    let listBtnToggle = findEls(fixture, "btnTogglePanel");
    expect(listBtnToggle.length).toEqual(3);
    const element = listBtnToggle[0];
    const event = makeClickEvent(element.nativeElement);
    element.triggerEventHandler("click", event);
    expect(component.togglePanel.includes(0)).toBeTruthy();
  });
  it("should toggle panel when run onTogglePanel", () => {
    component.onTogglePanel(1);
    expect(component.togglePanel.includes(1)).toBe(true);
    component.onTogglePanel(2);
    expect(component.togglePanel.includes(2)).toBe(true);
    component.onTogglePanel(1);
    expect(component.togglePanel.includes(1)).toBe(false);
  });
});
