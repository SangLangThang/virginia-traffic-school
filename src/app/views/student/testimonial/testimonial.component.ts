import { Component, OnDestroy, OnInit } from "@angular/core";
import { SwiperOptions } from "swiper";
import { slides } from "../shared/data-students-shared";

@Component({
  selector: "app-testimonial",
  templateUrl: "./testimonial.component.html",
  styleUrls: ["./testimonial.component.scss"],
})
export class TestimonialComponent implements OnInit, OnDestroy {
  itemsPerSlide = 3;
  singleSlideOffset = true;
  noWrap = true;
  config: SwiperOptions;
  slides = slides
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
  ngOnDestroy() {}
}
