import { HttpErrorResponse } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { environment } from "../../../environments/environment";
import {
  allUsers,
  dataUser1,
  findUserByIdTokenRespon,
  responUserById,
  responUsers,
} from "../../testing/mockUserService";
import { UserDatabase, UsersService } from "./users.service";
describe("UsersService", () => {
  let service: UsersService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService],
    });
    service = TestBed.inject(UsersService);
    controller = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    controller.verify();
  });
  it("should get all user finish", () => {
    let response: UserDatabase[] | undefined;
    let expectedUrl = `${environment.BASE_URL_DATABASE}/users.json`;
    service.getUsers().subscribe((data) => {
      response = data;
    });
    controller.expectOne(expectedUrl).flush({ ...responUsers });
    expect(response).toEqual(allUsers);
  });
  it("should get all user is error and throw error", () => {
    const status = 500;
    const statusText = "Internal Server Error";
    const errorEvent = new ErrorEvent("API error");
    let actualError: HttpErrorResponse | undefined;
    let expectedUrl = `${environment.BASE_URL_DATABASE}/users.json`;
    service.getUsers().subscribe(
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
    controller.expectOne(expectedUrl).error(errorEvent, { status, statusText });
    if (!actualError) {
      throw new Error("Error needs to be defined");
    }
    expect(actualError.error).toBe(errorEvent);
    expect(actualError.status).toBe(status);
    expect(actualError.statusText).toBe(statusText);
  });
  it("should call patch API to update a user", () => {
    let response: UserDatabase | undefined;
    let userData = dataUser1;
    let id = "-Mp7C55cppulwNrbj0hi";
    let expectedUrl = `${environment.BASE_URL_USERS}/${id}/.json`;
    let newUserData = { ...userData, displayName: "Test Update User" };
    service
      .updateUser(id, newUserData)
      .subscribe((data: UserDatabase) => (response = data));
    controller
      .expectOne({
        method: "PATCH",
        url: expectedUrl,
      })
      .flush({ ...newUserData });
    expect(response).toEqual(newUserData);
  });
  it("should get User by email", () => {
    let response: UserDatabase;
    service.currentUserDatabaseSubject.subscribe((user: UserDatabase) => {
      response = user;
    });
    let userData = dataUser1;
    let expectedUrl = `${environment.BASE_URL_DATABASE}/users.json?orderBy="email"&equalTo="${userData.email}"&print=pretty`;
    service.getUserByEmail(userData.email);
    controller
      .expectOne({
        method: "GET",
        url: expectedUrl,
      })
      .flush({ "-Mp7C55cppulwNrbj0hi": { ...userData } });
    expect(response).toEqual({
      ...userData,
      databaseId: "-Mp7C55cppulwNrbj0hi",
    });
  });
  it("should get user and create UserDatabase", () => {
    let idToken =
      "eyJhbGciOiJSUzI1NiIsImtpZCI6IjgwNTg1Zjk5MjExMmZmODgxMTEzOTlhMzY5NzU2MTc1YWExYjRjZjkiLCJ0eXAiOiJKV1QifQ";
    let response: UserDatabase;
    service.currentUserDatabaseSubject.subscribe((user: UserDatabase) => {
      response = user;
    });
    service.getUserAndCreateUserDatabase(idToken);
    controller
      .expectOne({
        method: "POST",
        url: `${environment.BASE_URL_USER}${environment.API_KEY}`,
      })
      .flush({ ...findUserByIdTokenRespon });
    controller
      .expectOne({
        method: "POST",
        url: `${environment.BASE_URL_DATABASE}/users.json`,
      })
      .flush({ name: "-Mp_CrgTndSd60khTk1a" });
    controller
      .expectOne({
        method: "GET",
        url: `${environment.BASE_URL_USERS}/-Mp_CrgTndSd60khTk1a.json`,
      })
      .flush({ ...responUserById });
    expect(response).toEqual(responUserById);
  });
});
