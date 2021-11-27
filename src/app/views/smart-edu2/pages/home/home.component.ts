import { Component, OnInit } from "@angular/core";
import { SwiperOptions } from "swiper";
import { homeSlides } from "../../shared/shared";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  config: SwiperOptions;
  homeSlides = homeSlides;
  constructor() {}

  ngOnInit(): void {
    this.config = {
      speed: 600,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      spaceBetween: 10,
    };
  }
}
