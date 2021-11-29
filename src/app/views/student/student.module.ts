import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { IconModule } from "@coreui/icons-angular";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgxHideOnScrollModule } from "ngx-hide-on-scroll";
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { AboutUsComponent } from "./about-us/about-us.component";
import { FaqComponent } from "./faq/faq.component";
import { HomeComponent } from "./home/home.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { HeaderComponent } from "./layout/header/header.component";
import { LayoutComponent } from "./layout/layout.component";
import { TestimonialComponent } from "./testimonial/testimonial.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: "home", component: HomeComponent },
  { path: "start-course", component: HomeComponent },
  { path: "testimonials", component: HomeComponent },
  { path: "how-it-work", component: HomeComponent },
  { path: "faq", component: HomeComponent },
  { path: "about-us", component: AboutUsComponent },
  { path: "contact-us", component: HomeComponent },
  { path: "login", component: HomeComponent },
  { path: "privacy-policy", component: HomeComponent },
  { path: "refund-policy", component: HomeComponent },
  { path: "terms", component: HomeComponent },
];

@NgModule({
  declarations: [
    HomeComponent,
    TestimonialComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    AboutUsComponent,
    FaqComponent,
  ],
  imports: [
    CommonModule,
    AccordionModule.forRoot(),
    NgbModule,
    NgxHideOnScrollModule,
    IconModule,
    RouterModule.forChild(routes),
    ScrollToModule.forRoot(),
    CarouselModule.forRoot(),
    NgxUsefulSwiperModule,
    CollapseModule.forRoot(),

  ],
  exports: [RouterModule],
})
export class StudentModule {}
