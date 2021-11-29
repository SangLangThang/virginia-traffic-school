import { Component } from "@angular/core";
import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  Benefit,
  benefitFeatured,
  Info,
  infos,
  Slide,
  slides,
  slidesFeatured,
} from "./student-home.data";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  providers: [NgbCarouselConfig],
})
export class HomeComponent {
  benefitFeatured: Benefit[] = benefitFeatured;
  infos: Info[] = infos;
  slidesFeatured: Slide[] = slidesFeatured;
  slides: Slide[] = slides;
  constructor() {}
}
