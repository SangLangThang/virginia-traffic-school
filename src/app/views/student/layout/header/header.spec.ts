import { BreakpointObserver, MediaMatcher } from "@angular/cdk/layout";
import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
} from "@angular/core/testing";
import {
  click,
  FakeMediaMatcher,
} from "../../../../testing/element.spec-helper";
import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let breakpointObserver: BreakpointObserver;
  let mediaMatcher: FakeMediaMatcher;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [{ provide: MediaMatcher, useClass: FakeMediaMatcher }],
    }).compileComponents();
  }));
  beforeEach(async () => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject(
    [BreakpointObserver, MediaMatcher],
    (bm: BreakpointObserver, mm: FakeMediaMatcher) => {
      breakpointObserver = bm;
      mediaMatcher = mm;
    }
  ));

  afterEach(() => {
    mediaMatcher.clear();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("emits a true matches state when the query is matched and toggleMenuMobile toggle value  ", fakeAsync(() => {
    let toggleMenuMobileOld = component.toggleMenuMobile;
    const query = "(max-width: 991px)";
    breakpointObserver.observe(query).subscribe();
    mediaMatcher.setMatchesQuery(query, true);
    tick();
    click(fixture, "hamburger");
    expect(component.canToggle).toBe(true);
    expect(component.toggleMenuMobile).toBe(!toggleMenuMobileOld);
    expect(breakpointObserver.isMatched(query)).toBeTruthy();
  }));
  it("emits a false matches state when the query is not matched and toggleMenuMobile toggle value  ", fakeAsync(() => {
    let toggleMenuMobileOld = component.toggleMenuMobile;
    const query = "(max-width: 991px)";
    breakpointObserver.observe(query).subscribe();
    mediaMatcher.setMatchesQuery(query, false);
    tick();
    click(fixture, "hamburger");
    expect(component.canToggle).toBe(false);
    expect(component.toggleMenuMobile).toBe(toggleMenuMobileOld);
    expect(breakpointObserver.isMatched(query)).toBeFalsy();
  }));
});
