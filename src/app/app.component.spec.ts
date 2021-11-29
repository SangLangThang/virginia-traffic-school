import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BehaviorSubject, of } from "rxjs";
import { AppComponent } from "./app.component";
import { AuthService, User } from "./services/auth/auth.service";
import {
  mockAuthResponseData,
  mockUserData,
} from "./testing/mockDataAuthService";
describe("AppComponent", () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  let fakeAuthService: Pick<AuthService, keyof AuthService>;
  let fakeCurrentUser$: BehaviorSubject<User>;

  beforeEach(async () => {
    localStorage.setItem("userData", JSON.stringify(mockUserData));
    fakeCurrentUser$ = new BehaviorSubject(null);
    fakeAuthService = {
      currentUser: fakeCurrentUser$,
      signup(email: string, password: string) {
        return mockAuthResponseData('test@gmail.com');
      },
      login(email: string, password: string) {
        return mockAuthResponseData('test@gmail.com');
      },
      autoLogin() {
        
        //check local store
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem("userData"));
        if (!userData) {
          return;
        }
        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );
        if (loadedUser.token) {
          fakeCurrentUser$.next(loadedUser);
          fixture.detectChanges();
        }
      },
      logout() {},
      autoLogout() {},
      handleAuthentication(
        email: string,
        userId: string,
        token: string,
        expiresIn: number
      ) {},
    };

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: AuthService, useValue: fakeAuthService }],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it("should create the app", () => {
    expect(component).toBeTruthy();
  });
  it("should auto login when LocalStorage have item userData", () => {
    expect(fakeCurrentUser$.value).toEqual(mockUserData);
  });
});
