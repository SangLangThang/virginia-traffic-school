import { Component, OnInit } from "@angular/core";
import { SwiperOptions } from "swiper";
import {
  benefitFeatured,
  FAQs,
  featuredCourses,
  slides,
  swiperDatas,
  virginaPrograms,
} from "../shared/data-smart-edu";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  slides = slides;
  benefitFeatured = benefitFeatured;
  virginaPrograms = virginaPrograms;
  featuredCourses = featuredCourses;
  FAQs = FAQs;
  swiperDatas = swiperDatas
  togglePanel: any[] = [];

  config: SwiperOptions;
  constructor() {}
  ngOnInit(): void {
    this.config = {
      breakpoints: {
        "576": {
          slidesPerView: 1,
        },
        "768": {
          slidesPerView: 2,
        },
        "991": {
          slidesPerView: 3,
        },
      },
      loop: false,
      pagination: false,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      spaceBetween: 0,
    };
  }

  onTogglePanel(index: number) {
    if (this.togglePanel.includes(index)) {
      this.togglePanel = this.togglePanel.filter((x) => x != index);
      return;
    }
    this.togglePanel.push(index);
  }
}
