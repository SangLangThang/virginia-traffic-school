import { ComponentFixture, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { click, findEls, makeClickEvent } from "../../../testing/element.spec-helper";

import { FaqComponent } from "./faq.component";

describe("FaqComponent", () => {
  let component: FaqComponent;
  let fixture: ComponentFixture<FaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FaqComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should toggle panel when click btn", () => {
    let listBtnToggle = findEls(fixture, "btnTogglePanel");
    expect(listBtnToggle.length).toEqual(3);
    const element = listBtnToggle[0]
    const event = makeClickEvent(element.nativeElement);
    element.triggerEventHandler('click', event);
    expect(component.togglePanel.includes(0)).toBeTruthy();
  });
  it("should toggle panel when run onTogglePanel", () => {
    component.onTogglePanel(1)
    expect(component.togglePanel.includes(1)).toBe(true)
    component.onTogglePanel(2)
    expect(component.togglePanel.includes(2)).toBe(true)
    component.onTogglePanel(1)
    expect(component.togglePanel.includes(1)).toBe(false)
  });
});
