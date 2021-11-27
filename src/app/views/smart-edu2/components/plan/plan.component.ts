import { Component, OnInit } from "@angular/core";
import { PlanServicesService } from "../../shared/plan-services.service";

@Component({
  selector: "app-plan",
  templateUrl: "./plan.component.html",
  styleUrls: ["./plan.component.scss"],
})
export class PlanComponent implements OnInit {
  constructor(private planServicesService: PlanServicesService) {}

  ngOnInit(): void {}
  onChangePrice(plan: string) {
    this.planServicesService.changePricingFeatures(plan);
  }
}
