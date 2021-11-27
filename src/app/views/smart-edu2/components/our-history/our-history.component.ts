import { Component, OnInit } from "@angular/core";
import { SwiperOptions } from "swiper";
import { ourHistorys } from "../../shared/shared";
@Component({
  selector: "app-our-history",
  templateUrl: "./our-history.component.html",
  styleUrls: ["./our-history.component.scss"],
})
export class OurHistoryComponent implements OnInit {
  constructor() {}
  ourHistorys = ourHistorys;
  config: SwiperOptions;
  ngOnInit(): void {
    this.config ={
      breakpoints:{
        '576': {
          slidesPerView: 2,
        },
        '768': {
          slidesPerView: 2,
        },
        '991': {
          slidesPerView: 3,
        },
        '1200': {
          slidesPerView: 4,
        }
      },
      loop :false,
      pagination: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      spaceBetween: 0
    };  
  }
}
