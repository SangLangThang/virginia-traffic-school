import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { pricingFeatures } from "./shared";

@Injectable({
  providedIn: "root",
})
export class PlanServicesService {
  pricingFeatures = pricingFeatures.map((e, index) => {
    let newElement = { ...e };
    newElement.time = "year";
    newElement.price = String(+pricingFeatures[index].price * 12 - 23);
    return newElement;
  });
  pricingFeaturesChange = new BehaviorSubject(pricingFeatures);
  constructor() {}
  changePricingFeatures(plan: string) {
    if (plan === "month") {
      this.pricingFeaturesChange.next(pricingFeatures);
      
      return;
    }else{
      this.pricingFeaturesChange.next(this.pricingFeatures);
    }
  }
}
