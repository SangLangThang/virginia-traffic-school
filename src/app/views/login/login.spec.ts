import { HttpClientModule } from "@angular/common/http";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { AuthService } from "../../services/auth/auth.service";
import {
  expectText,
  findEl,
  setFieldValue,
} from "../../testing/element.spec-helper";
import { mockAuthResponseData } from "../../testing/mockDataAuthService";
import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  const fillForm = (email: string, pass: string) => {
    setFieldValue(fixture, "email", email);
    setFieldValue(fixture, "password", pass);
  };
  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj("Router", ["navigate", "url"]);
    authServiceSpy = jasmine.createSpyObj("AuthService", ["login"]);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule],
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create the component", () => {
    expect(component).toBeTruthy();
  });
  it("submits the form successfully", fakeAsync(async () => {
    authServiceSpy.login.and.returnValue(
      mockAuthResponseData("test@gmail.com")
    );
    fillForm("test@gmail.com", "111111");
    fixture.detectChanges();
    expect(findEl(fixture, "submit").properties.disabled).toBe(false);
    findEl(fixture, "form").triggerEventHandler("submit", {});
    tick(1000);
    expect(component.isLoading).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalled();
    const navArgs = routerSpy.navigate.calls.first().args[0];
    expect(navArgs).toEqual(["/dashboard/user"], "should nav to User Page");
  }));
  it("submits the form successfully with admin ", fakeAsync(async () => {
    authServiceSpy.login.and.returnValue(
      mockAuthResponseData("admin@admin.com")
    );
    fillForm("admin@admin.com", "111111");
    fixture.detectChanges();
    expect(findEl(fixture, "submit").properties.disabled).toBe(false);
    findEl(fixture, "form").triggerEventHandler("submit", {});
    tick(1000);
    expect(component.isLoading).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalled();
    const navArgs = routerSpy.navigate.calls.first().args[0];
    expect(navArgs).toEqual(["/dashboard/admin"], "should nav to User Page");
  }));
  it("submits the form with error ", fakeAsync(async () => {
    authServiceSpy.login.and.returnValue(throwError("Test error message"));
    component.error = "Test error message";
    fillForm("admin@admin.com", "1111111111");
    fixture.detectChanges();
    expect(findEl(fixture, "submit").properties.disabled).toBe(false);
    findEl(fixture, "form").triggerEventHandler("submit", {});
    tick(1000);
    expect(component.isLoading).toBe(false);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expectText(fixture, "error", "Oh snap! Test error message ");
  }));

  it("does not submit an invalid form", fakeAsync(async () => {
    expect(findEl(fixture, "submit").properties.disabled).toBe(true);
    findEl(fixture, "form").triggerEventHandler("submit", {});
    tick(1000);
    expect(component.isLoading).toBe(false);
  }));
});
