import { NgModule } from "@angular/core";
import { ExtraOptions, RouterModule, Routes } from "@angular/router";
// Import Containers
import { DefaultLayoutComponent } from "./containers";
import { ProductsComponent } from "./products/products.component";
import { AuthGuard } from "./services/auth/auth.guard";
import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";
import { PermissionComponent } from "./views/error/permission.component";
import { LoginComponent } from "./views/login/login.component";
import { RegisterComponent } from "./views/register/register.component";
import { SmartEdu2Component } from "./views/smart-edu2/smart-edu2.component";
import { SmartEduLayoutComponent } from "./views/smartEdu/smart-edu-layout/smart-edu-layout.component";
import { LayoutComponent } from "./views/student/layout/layout.component";
import { UserComponent } from "./views/user/user.component";
const routerOptions: ExtraOptions = {
  anchorScrolling: "enabled",
  //scrollPositionRestoration: "enabled"
};
export const routes: Routes = [
  {
    path: "",
    redirectTo: "products",
    pathMatch: "full",
  },
  {
    path: "products",
    component: ProductsComponent,
  },
  {
    path: "student",
    component: LayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./views/student/student.module").then((m) => m.StudentModule),
      },
    ],
  },
  {
    path: "smart-edu",
    component: SmartEduLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./views/smartEdu/smart-edu.module").then(
            (m) => m.SmartEduModule
          ),
      },
    ],
  },
  {
    path: "smart-edu2",
    component: SmartEdu2Component,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./views/smart-edu2/smart-edu2.module").then(
            (m) => m.SmartEdu2Module
          ),
      },
    ],
  },

  {
    path: "404",
    component: P404Component,
    data: {
      title: "Page 404",
    },
  },
  {
    path: "permission",
    component: PermissionComponent,
    data: {
      title: "Access denied",
    },
  },
  {
    path: "500",
    component: P500Component,
    data: {
      title: "Page 500",
    },
  },
  {
    path: "login",
    component: LoginComponent,
    data: {
      title: "Login Page",
    },
  },
  {
    path: "register",
    component: RegisterComponent,
    data: {
      title: "Register Page",
    },
  },

  {
    path: "dashboard",
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Dashboard",
    },
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./views/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: "user",
        children: [
          {
            path: "",
            component: UserComponent,
          },
        ],
      },
      {
        path: "admin",
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import("./views/admin/admin.module").then((m) => m.AdminModule),
      },
    ],
  },
  { path: "**", component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
