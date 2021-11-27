import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-smart-edu-layout",
  templateUrl: "./smart-edu-layout.component.html",
  styleUrls: ["./smart-edu-layout.component.scss"],
})
export class SmartEduLayoutComponent implements OnInit {
  timeTimeout: any;
  loading = true;
  constructor() {}

  ngOnInit(): void {
    /* this.timeTimeout = setTimeout(() => {
      this.loading = false;
      clearTimeout(this.timeTimeout)
    }, 10000); */
  }
}
