import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { PlanServicesService } from "../../../shared/plan-services.service";
import { pricingFeatures } from "../../../shared/shared";

@Component({
  selector: "app-price",
  templateUrl: "./price.component.html",
  styleUrls: ["./price.component.scss"],
})
export class PriceComponent implements OnInit {
  pricingFeatures;
  pricingFeaturesSub: Subscription;
  constructor(private planServicesService: PlanServicesService) {}

  ngOnInit(): void {
    this.pricingFeaturesSub =
      this.planServicesService.pricingFeaturesChange.subscribe((data) => {
        this.pricingFeatures = data;
      });
  }
}
