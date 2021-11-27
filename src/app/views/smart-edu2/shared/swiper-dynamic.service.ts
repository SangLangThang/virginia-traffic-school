import {
  ComponentFactoryResolver,
  Injectable,
  ViewContainerRef,
} from "@angular/core";
import { SwiperDynamicComponent } from "./swiper-dynamic/swiper-dynamic.component";

@Injectable({
  providedIn: "root",
})
export class SwiperDynamicService {
  constructor(private cfr: ComponentFactoryResolver) {}

  loadComponent(vcr: ViewContainerRef) {
    vcr.clear();
    let component = SwiperDynamicComponent;
    return vcr.createComponent(this.cfr.resolveComponentFactory(component));
  }
}
