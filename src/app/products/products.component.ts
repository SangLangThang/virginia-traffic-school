import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AdminService, Product } from "../services/admin/admin.service";


@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit {
  products: Product[];
  stars = [1, 2, 3, 4, 5];
  constructor(private adminServices:AdminService) {}

  ngOnInit(): void {
    this.products = this.adminServices.getProducts()
  }
}
