import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import {
  AuthResponseData,
  AuthService,
} from "../../services/auth/auth.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "register.component.html",
})
export class RegisterComponent implements OnInit {
  isLoading = false;
  error: string = null;
  registerForm: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}
  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.registerForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      repeatPassword: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(form: FormGroup) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    authObs = this.authService.signup(email, password);

    authObs.subscribe(
      (resData) => {
        console.log(resData);
        this.isLoading = false;
        form.reset();
        this.router.navigate(["/dashboard"]);
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );
  }
}
