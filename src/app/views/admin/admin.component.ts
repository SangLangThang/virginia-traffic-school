import { Component, OnInit } from "@angular/core";
import { AdminService, Product } from "../../services/admin/admin.service";
import { UserDatabase, UsersService } from "../../services/users/users.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit {
  usersData: UserDatabase[];
  products: Product[];
  stars = [1, 2, 3, 4, 5];
  themes: any;
  constructor(
    private usersService: UsersService,
    private adminServices: AdminService
  ) {}

  ngOnInit(): void {
    this.products = this.adminServices.getProducts();
    this.adminServices.getThemes().subscribe(data=>{
      console.log(data)
    })
    this.usersService.getUsers().subscribe((usersData: UserDatabase[]) => {
      this.usersData = usersData;
    });
  }
}
