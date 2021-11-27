import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormControl, NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "../../services/auth/auth.service";
import { UserThemeService } from "../../services/themes/user-theme.service";
import { UserDatabase, UsersService } from "../../services/users/users.service";
import { acountUser } from "../../views/user/variablesUser";
import { navItems } from "../../_nav";

@Component({
  selector: "app-dashboard",
  templateUrl: "./default-layout.component.html",
  styleUrls: ["./default-layout.component.scss"],
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  public sidebarMinimized = false;
  public navItems = navItems;
  currentUserDatabase: UserDatabase;
  usersServiceSub: Subscription;
  acountUser = acountUser;
  listsTheme: { Code: string; Name: string }[] = [];
  public selectControl = new FormControl();
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private themeService: UserThemeService,
    private router:Router,
    private route:ActivatedRoute
  ) {}
  ngOnInit() {
    this.usersServiceSub =
      this.usersService.currentUserDatabaseSubject.subscribe(
        (currentUserDatabase) => {
          this.currentUserDatabase = currentUserDatabase;
        }
      );
    this.listsTheme = this.themeService.getListsTheme();
    this.selectControl.valueChanges.subscribe((value) =>
      this.themeService.setTheme(value)
    );
  }
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  onLogout() {
    this.authService.logout();
  }
  ngOnDestroy() {
    this.usersServiceSub && this.usersServiceSub.unsubscribe();
  }
}
