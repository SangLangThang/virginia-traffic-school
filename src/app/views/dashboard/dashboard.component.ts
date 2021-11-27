import { Component, OnInit } from "@angular/core";
import { AdminService, Product } from "../../services/admin/admin.service";

@Component({
  templateUrl: "dashboard.component.html",
  styleUrls:['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  products: Product[];
  stars = [1, 2, 3, 4, 5];
  constructor(private adminServices: AdminService) {}

  ngOnInit(): void {
    this.products = this.adminServices.getProducts();
  }
}
