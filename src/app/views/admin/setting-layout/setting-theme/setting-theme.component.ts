import { Route } from "@angular/compiler/src/core";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "../../../../services/admin/admin.service";

export interface ThemeData {
  price: string;
  email: string;
  storage: string;
  databases: string;
  domains: string;
  support: string;
}
@Component({
  selector: "app-setting-theme",
  templateUrl: "./setting-theme.component.html",
  styleUrls: ["./setting-theme.component.scss"],
})
export class SettingThemeComponent implements OnInit {
  pricingFeatures = [
    {
      price: "45",
      time: "per month",
      features: [
        {
          icon: "fa-envelope-o",
          value: "250",
          name: " Email Addresses",
        },
        {
          icon: "fa-rocket",
          value: "125GB",
          name: " of Storage",
        },
        {
          icon: "fa-database",
          value: "140",
          name: " Databases",
        },
        {
          icon: "fa-link",
          value: "60",
          name: " Domains",
        },
        {
          icon: "fa-life-ring",
          value: "24/7 Unlimited",
          name: " Support",
        },
      ],
    },
    {
      price: "45",
      time: "per month",
      features: [
        {
          icon: "fa-envelope-o",
          value: "250",
          name: " Email Addresses",
        },
        {
          icon: "fa-rocket",
          value: "125GB",
          name: " of Storage",
        },
        {
          icon: "fa-database",
          value: "140",
          name: " Databases",
        },
        {
          icon: "fa-link",
          value: "60",
          name: " Domains",
        },
        {
          icon: "fa-life-ring",
          value: "24/7 Unlimited",
          name: " Support",
        },
      ],
    },
    {
      price: "45",
      time: "per month",
      features: [
        {
          icon: "fa-envelope-o",
          value: "250",
          name: " Email Addresses",
        },
        {
          icon: "fa-rocket",
          value: "125GB",
          name: " of Storage",
        },
        {
          icon: "fa-database",
          value: "140",
          name: " Databases",
        },
        {
          icon: "fa-link",
          value: "60",
          name: " Domains",
        },
        {
          icon: "fa-life-ring",
          value: "24/7 Unlimited",
          name: " Support",
        },
      ],
    },
  ];
  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router:Router
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.adminService.idTheme.next(params["id"]);
    });
  }
  editPlan(index:number){
    this.router.navigate(['plans'], {queryParams:{'index':index}, relativeTo: this.route });
    this.adminService.idChild.next('plans')
  }
}
