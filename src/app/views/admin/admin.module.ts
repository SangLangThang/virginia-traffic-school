import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { ToastModule } from "../../services/toast/toast.module";
import { AdminComponent } from "./admin.component";
import { EditPlanComponent } from "./setting-layout/edit-plan/edit-plan.component";
import { SettingLayoutComponent } from "./setting-layout/setting-layout.component";
import { SettingThemeComponent } from "./setting-layout/setting-theme/setting-theme.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Admin",
    },
    children: [
      {
        path: "",
        redirectTo: "manager",
      },
      {
        path: "manager",
        component: AdminComponent,
        data: {
          title: "Manager",
        },
      },
      {
        path: "themes",
        data: {
          title: "Themes",
        },
        component:SettingLayoutComponent,
        children: [
          {
            path: ':id/plans',
            component: EditPlanComponent,
          },
          {
            path: ':id',
            component: SettingThemeComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [
    SettingThemeComponent,
    AdminComponent,
    EditPlanComponent,
    SettingLayoutComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ToastModule,
  ],
  exports: [RouterModule],
})
export class AdminModule {}
