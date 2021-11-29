import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import {
  AuthResponseData,
  AuthService,
} from "../../services/auth/auth.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "login.component.html",
})
export class LoginComponent implements OnInit {
  isLoading = false;
  error: string = null;
  loginForm: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}
  ngOnInit() {
    this.buillForm();
  }

  buillForm() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(form: FormGroup) {
    if (!form.valid) {
      return;
    }
    let authObs: Observable<AuthResponseData>;
    this.isLoading = true;
    authObs = this.authService.login(form.value.email, form.value.password);
    authObs.subscribe(
      (resData) => {
        this.isLoading = false;
        form.reset();
        if (resData.email === "admin@admin.com") {
          this.router.navigate(["/dashboard/admin"]);
        } else {
          this.router.navigate(["/dashboard/user"]);
        }
      },
      (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
  }
}
