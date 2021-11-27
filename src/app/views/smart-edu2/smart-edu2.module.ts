import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NgxHideOnScrollModule } from "ngx-hide-on-scroll";
import { NgxUsefulSwiperModule } from "ngx-useful-swiper";
import { AboutComponent } from "./components/about/about.component";
import { MilestonesComponent } from "./components/milestones/milestones.component";
import { OurHistoryComponent } from "./components/our-history/our-history.component";
import { TimelineItemComponent } from "./components/our-history/timeline-item/timeline-item.component";
import { PartnerComponent } from "./components/partner/partner.component";
import { PlanComponent } from "./components/plan/plan.component";
import { PriceComponent } from "./components/plan/price/price.component";
import { TestimonialsComponent } from "./components/testimonials/testimonials.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { HeaderComponent } from "./layout/header/header.component";
import { HomeComponent } from "./pages/home/home.component";
import { SwiperDynamicComponent } from "./shared/swiper-dynamic/swiper-dynamic.component";
import { SmartEdu2Component } from "./smart-edu2.component";
import { TimelineSingleComponent } from './components/our-history/timeline-single/timeline-single.component';
const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "**", redirectTo: "home" },
];

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SmartEdu2Component,
    PlanComponent,
    PriceComponent,
    MilestonesComponent,
    TestimonialsComponent,
    AboutComponent,
    PartnerComponent,
    OurHistoryComponent,
    SwiperDynamicComponent,
    TimelineItemComponent,
    TimelineSingleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxHideOnScrollModule,
    NgxUsefulSwiperModule,
  ],
})
export class SmartEdu2Module {}
