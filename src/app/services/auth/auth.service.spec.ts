import { HttpErrorResponse } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { environment } from "../../../environments/environment";
import {
  MOCK_EMAIL_EXISTS_ERROR_RESPONSE,
  MOCK_EMAIL_NOT_FOUND_ERROR_RESPONSE,
  MOCK_INVALID_PASSWORD_ERROR_RESPONSE,
  MOCK_SIGNUP_DATA_RESPONSE,
  MOCK_USERDATA_WITH_OUT_TIME,
} from "../../testing/mockDataAuthService";
import { AuthResponseData, AuthService, User } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;
  let controller: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  beforeEach(() => {
    routerSpy = jasmine.createSpyObj("Router", ["navigate", "url"]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: routerSpy }],
    });
    service = TestBed.inject(AuthService);
    controller = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });
  afterEach(() => {
    controller.verify();
  });
  it("should signup with email and pass correct", () => {
    let response: AuthResponseData | undefined;
    let newUser = { email: "usertest@gmail.com", pass: "111111" };
    let expectedUrlOne = `${environment.BASE_URL_SIGNUP}${environment.API_KEY}`;
    let expectedUrlTwo = `${environment.BASE_URL_USER}${environment.API_KEY}`;
    service.signup(newUser.email, newUser.pass).subscribe((data) => {
      response = data;
    });
    let firstCall = controller.expectOne({
      method: "POST",
      url: expectedUrlOne,
    });
    firstCall.flush({ ...MOCK_SIGNUP_DATA_RESPONSE });
    expect(response).toEqual(MOCK_SIGNUP_DATA_RESPONSE);
    let firstTwo = controller.expectOne({
      method: "POST",
      url: expectedUrlTwo,
    });
  });
  it("should respon error exists email when signup with exists email", () => {
    const errorEvent = new ErrorEvent("API error", {
      ...MOCK_EMAIL_EXISTS_ERROR_RESPONSE,
    });
    let actualError: string | undefined;
    let newUser = { email: "usertest@gmail.com", pass: "111111" };
    let expectedUrlOne = `${environment.BASE_URL_SIGNUP}${environment.API_KEY}`;
    service.signup(newUser.email, newUser.pass).subscribe(
      () => {
        fail("next handler must not be called");
      },
      (error) => {
        actualError = error;
      },
      () => {
        fail("complete handler must not be called");
      }
    );
    let firstCall = controller.expectOne({
      method: "POST",
      url: expectedUrlOne,
    });
    firstCall.error(errorEvent);
    if (!actualError) {
      throw new Error("Error needs to be defined");
    }
    expect(actualError).toBe("This email exists already");
  });
  it("should respon error exists email when signup with exists email", () => {
    let actualError: string | undefined;
    let newUser = { email: "usertest@gmail.com", pass: "111111" };
    let expectedUrlOne = `${environment.BASE_URL_SIGNUP}${environment.API_KEY}`;
    service.signup(newUser.email, newUser.pass).subscribe(
      () => {
        fail("next handler must not be called");
      },
      (error) => {
        actualError = error;
      },
      () => {
        fail("complete handler must not be called");
      }
    );
    let firstCall = controller.expectOne({
      method: "POST",
      url: expectedUrlOne,
    });
    firstCall.error(new ErrorEvent("An unknown error occurred!"));
    expect(actualError).toBe("An unknown error occurred!");
  });

  it("should login with email and pass correct", () => {
    let response: AuthResponseData | undefined;
    let newUser = { email: "usertest@gmail.com", pass: "111111" };
    let expectedUrlOne = `${environment.BASE_URL_LOGIN}${environment.API_KEY}`;
    let expectedUrlTwo = `${environment.BASE_URL_DATABASE}/users.json?orderBy="email"&equalTo="${newUser.email}"&print=pretty`;
    service.login(newUser.email, newUser.pass).subscribe((data) => {
      response = data;
    });
    let firstCall = controller.expectOne({
      method: "POST",
      url: expectedUrlOne,
    });
    firstCall.flush({ ...MOCK_SIGNUP_DATA_RESPONSE });
    expect(response).toEqual(MOCK_SIGNUP_DATA_RESPONSE);
    let firstTwo = controller.expectOne({
      method: "GET",
      url: expectedUrlTwo,
    });
  });
  it("should respon email not found when login with wrong email ", () => {
    let errorEvent = new ErrorEvent("API error", {
      ...MOCK_EMAIL_NOT_FOUND_ERROR_RESPONSE,
    });
    let actualError: string | undefined;
    let newUser = { email: "usertest111@gmail.com", pass: "111111" };
    let expectedUrlOne = `${environment.BASE_URL_LOGIN}${environment.API_KEY}`;
    service.login(newUser.email, newUser.pass).subscribe(
      () => {
        fail("next handler must not be called");
      },
      (error) => {
        actualError = error;
      },
      () => {
        fail("complete handler must not be called");
      }
    );
    let firstCall = controller.expectOne({
      method: "POST",
      url: expectedUrlOne,
    });
    firstCall.error(errorEvent);
    expect(actualError).toBe("This email does not exist.");
  });
  it("should respon pass invalid  when login with wrong pass ", () => {
    let errorEvent = new ErrorEvent("API error", {
      ...MOCK_INVALID_PASSWORD_ERROR_RESPONSE,
    });
    let actualError: string | undefined;
    let newUser = { email: "usertest111@gmail.com", pass: "111111" };
    let expectedUrlOne = `${environment.BASE_URL_LOGIN}${environment.API_KEY}`;
    service.login(newUser.email, newUser.pass).subscribe(
      () => {
        fail("next handler must not be called");
      },
      (error) => {
        actualError = error;
      },
      () => {
        fail("complete handler must not be called");
      }
    );
    let firstCall = controller.expectOne({
      method: "POST",
      url: expectedUrlOne,
    });
    firstCall.error(errorEvent);
    expect(actualError).toBe("This password is not correct.");
  });
  it("should logout and clear data ", () => {
    let actualUser: User;
    service.currentUser.subscribe((user) => (actualUser = user));
    service.logout();
    expect(actualUser).toEqual(null);
    expect(routerSpy.navigate).toHaveBeenCalled();
    const navArgs = routerSpy.navigate.calls.first().args[0];
    expect(navArgs).toEqual(["/login"], "should nav to login page");
    expect(localStorage.getItem("userData")).toBe(null);
  });
  it("should auto login when localStorega have userData and auto logout when expirationDuration out time ", () => {
    let userData = { ...MOCK_USERDATA_WITH_OUT_TIME };
    let expectedUrlTwo = `${environment.BASE_URL_DATABASE}/users.json?orderBy="email"&equalTo="${userData.email}"&print=pretty`;
    
    //function retun void when no user data from localStorage
    service.autoLogin();
    expect(JSON.parse(localStorage.getItem("userData"))).toBe(null);

    //function run when have user data from localStorage
    localStorage.setItem("userData", JSON.stringify(userData));
    expect(JSON.parse(localStorage.getItem("userData"))).toBeTruthy();
    service.autoLogin();
    controller.expectOne({
        method: "GET",
        url: expectedUrlTwo,
      });
    
    localStorage.clear();
    expect(JSON.parse(localStorage.getItem("userData"))).toBe(null);
    userData = {
      ...userData,
      _tokenExpirationDate: "2020-10-20T12:56:09.849Z",
    };
    localStorage.setItem("userData", JSON.stringify(userData));
    service.autoLogin();
  });
});
