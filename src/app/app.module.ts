import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppFooterModule,
  AppHeaderModule,
  AppSidebarModule,
} from "@coreui/angular";
import {
  IconModule,
  IconSetModule,
  IconSetService,
} from "@coreui/icons-angular";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ChartsModule } from "ng2-charts";
import { AlertModule } from "ngx-bootstrap/alert";
// Import 3rd party components
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from "ngx-perfect-scrollbar";
import { NgxSelectModule } from "ngx-select-ex";
import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
// Import routing module
import { AppRoutingModule } from "./app.routing";
// Import containers
import { DefaultLayoutComponent } from "./containers";
import { ProductsComponent } from "./products/products.component";
import { ToastModule } from "./services/toast/toast.module";
import { UserComponent } from "./views/user/user.component";
import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";
import { LoginComponent } from "./views/login/login.component";
import { RegisterComponent } from "./views/register/register.component";
import { StudentModule } from "./views/student/student.module";
import { PermissionComponent } from "./views/error/permission.component";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};
const APP_CONTAINERS = [DefaultLayoutComponent];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    IconModule,
    IconSetModule.forRoot(),
    StudentModule,
    HttpClientModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireStorageModule,
    NgxSelectModule,
    NgbModule,
    FormsModule,
    ToastModule,
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    PermissionComponent,
    RegisterComponent,
    ProductsComponent,
    UserComponent,
  ],
  providers: [IconSetService],
  bootstrap: [AppComponent],
})
export class AppModule {}
