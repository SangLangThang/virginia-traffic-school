import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, concatMap, map } from "rxjs/operators";
import { environment } from "../../../environments/environment";

export interface UserResponseData {
  localId: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  providerUserInfo: any;
  photoUrl: string;
  passwordHash: string;
  passwordUpdatedAt: any;
  validSince: string;
  disabled: boolean;
  lastLoginAt: string;
  createdAt: string;
  customAuth: boolean;
}

export interface UserDatabase {
  avatar: string;
  country: string;
  createdAt: string;
  email: string;
  lastLoginAt: string;
  localId: string;
  databaseId:string;
  displayName: string;
  paymentMethod: string;
  status: string;
  usage: string;
}

@Injectable({
  providedIn: "root",
})
export class UsersService {
  defautAvatar =
    "https://firebasestorage.googleapis.com/v0/b/virginia-traffic-school.appspot.com/o/avatars%2Fdefault.jfif?alt=media&token=bafe94d2-01bf-42db-b6d8-8853b9173da1";
  currentUserDatabaseSubject = new BehaviorSubject<UserDatabase>(null);
  currentUserDatabase: UserDatabase 
  databaseId = new BehaviorSubject<string>('');
  constructor(private http: HttpClient) {}

  updateUser(id: string, user: UserDatabase) {
    return this.http.patch(`${environment.BASE_URL_USERS}/${id}/.json`, user);
  }

  getUserByEmail(email: string) {
    this.http
      .get(
        `${environment.BASE_URL_DATABASE}/users.json?orderBy="email"&equalTo="${email}"&print=pretty`
      )
      .subscribe((resData: any) => {
        this.currentUserDatabase = { ...resData[Object.keys(resData)[0]],databaseId:Object.keys(resData)[0]  };
        this.currentUserDatabaseSubject.next(this.currentUserDatabase);
      });
  }

  getUserAndCreateUserDatabase(token: string) {
    this.http
      .post(`${environment.BASE_URL_USER}${environment.API_KEY}`, {
        idToken: token,
      })
      .pipe(
        concatMap((respon: any) => {
          const user: UserResponseData = respon.users[0];
          this.currentUserDatabase = {
            avatar: this.defautAvatar,
            country: "",
            createdAt: user.createdAt,
            email: user.email,
            lastLoginAt: user.lastLoginAt,
            localId: user.localId,
            databaseId:'',
            displayName: "",
            paymentMethod: "",
            status: "badge-success",
            usage: "",
          };
          return this.http.post(
            `${environment.BASE_URL_DATABASE}/users.json`,
            this.currentUserDatabase
          );
        })
      )
      .pipe(
        concatMap((responUserDatabase: any) => {
          this.currentUserDatabase.databaseId = responUserDatabase.name
          return this.http.get(
            `${environment.BASE_URL_USERS}/${responUserDatabase.name}.json`
          );
        })
      )
      .subscribe((user: UserDatabase) => {
        this.currentUserDatabaseSubject.next(user);
      });
  }

  getUsers() {
    return this.http.get(`${environment.BASE_URL_DATABASE}/users.json`).pipe(
      map((response) => {
        const postArray = [];
        for (let key in response) {
          postArray.push({ ...response[key], id: key });
        }
        return postArray;
      }),
      catchError((errorRes) => {
        return throwError(errorRes);
      })
    );
  }
}
