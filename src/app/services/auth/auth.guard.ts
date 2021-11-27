import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { ToastService } from "../toast/toast.service";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
    public toastService: ToastService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot) {
    return this.authService.currentUser.pipe(
      take(1),
      map((user) => {
        const isAuth = !!user;
        if (isAuth) {
          return true;
        }
        this.router.navigate(["/login"]);
        return false;
      })
    );
  }
  canActivateChild(route: ActivatedRouteSnapshot, router: RouterStateSnapshot) {
    return this.authService.currentUser.pipe(
      take(1),
      map((user) => {
        if (user.email === "admin@admin.com") {
          return true;
        }
        this.router.navigate(['/permission'])
        return false;
      })
    );
  }
}
