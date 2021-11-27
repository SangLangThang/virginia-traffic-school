import { Component, Input, OnInit } from "@angular/core";
import { SwiperOptions } from "swiper";
import { ourHistorys } from "../shared";

@Component({
  selector: "app-swiper-dynamic",
  templateUrl: "./swiper-dynamic.component.html",
  styleUrls: ["./swiper-dynamic.component.scss"],
})
export class SwiperDynamicComponent implements OnInit {
  @Input() itemsPerSlide: number;
  config: SwiperOptions;
  ourHistorys = ourHistorys
  constructor() {}

  ngOnInit(): void {
    this.config = {
      slidesPerView: 4,
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
