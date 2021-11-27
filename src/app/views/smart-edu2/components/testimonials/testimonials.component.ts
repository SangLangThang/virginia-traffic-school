import { Component, OnInit } from "@angular/core";
import { SwiperOptions } from "swiper";
import { testimonials } from "../../shared/shared";

@Component({
  selector: "app-testimonials",
  templateUrl: "./testimonials.component.html",
  styleUrls: ["./testimonials.component.scss"],
})
export class TestimonialsComponent implements OnInit {
  testimonials = testimonials;
  config: SwiperOptions;
  constructor() {}

  ngOnInit(): void {
    this.config = {
      speed: 600,
      loop: true,
      pagination: false,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      spaceBetween: 10,
    };
  }
}
