import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { NgxHideOnScrollModule } from "ngx-hide-on-scroll";
import { NgxUsefulSwiperModule } from "ngx-useful-swiper";
import { HomeComponent } from "./home/home.component";
import { FooterComponent } from "./smart-edu-layout/footer/footer.component";
import { HeaderComponent } from "./smart-edu-layout/header/header.component";
import { SmartEduLayoutComponent } from "./smart-edu-layout/smart-edu-layout.component";

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "**", component: HomeComponent },
];

@NgModule({
  declarations: [
    SmartEduLayoutComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    NgxHideOnScrollModule,
    NgxUsefulSwiperModule,
    RouterModule.forChild(routes),
    CollapseModule.forRoot(),
  ],
  exports: [RouterModule],
})
export class SmartEduModule {}
