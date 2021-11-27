import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "../../../environments/environment";

export interface Product {
  id?: string;
  img: string;
  url: string;
  name: string;
  stars: number;
}

@Injectable({
  providedIn: "root",
})
export class AdminService {
  products: Product[] = [
    {
      id: "theme1",
      img: "assets/img/products/theme-1.png",
      url: "/student",
      name: "Virginia Traffic School – Bootstrap 4 Template 1",
      stars: 5,
    },
    {
      id: "theme2",
      img: "assets/img/products/theme-2.png",
      url: "/smart-edu",
      name: "Virginia Traffic School – Bootstrap 4 Template 2",
      stars: 5,
    },
    {
      id: "theme3",
      img: "assets/img/products/theme-3.png",
      url: "/smart-edu2",
      name: "SmartEdu School – Bootstrap 4 Template 3",
      stars: 5,
    },
  ];
  idTheme = new BehaviorSubject("");
  idChild = new BehaviorSubject("");
  constructor(private http: HttpClient) {}

  getProducts() {
    return this.products;
  }
  getThemes() {
    return this.http.get(`${environment.BASE_URL_DATABASE}/themes.json`).pipe(
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
  getTheme(id: string) {
    return this.http
      .get(`${environment.BASE_URL_DATABASE}/themes/${id}.json`)
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }
  createThemeData(idTheme: string, idChild: string, index: string, data: any) {
    this.http
      .put(
        `${environment.BASE_URL_DATABASE}/themes/${idTheme}/${idChild}/${index}.json`,
        data
      )
      .pipe(
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      )
      .subscribe();
  }
  getThemeData(idTheme: string, idChild: string, index: string) {
    return this.http.get(
      `${environment.BASE_URL_DATABASE}/themes/${idTheme}/${idChild}/${index}.json`
    );
  }
}
