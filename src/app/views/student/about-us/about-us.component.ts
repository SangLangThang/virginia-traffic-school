import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-about-us",
  templateUrl: "./about-us.component.html",
  styleUrls: ["./about-us.component.scss"],
})
export class AboutUsComponent implements OnInit {
  timeInterval: any;
  counter = 0;
  milestones = [
    { name: "courses", max: 123, start: 0 },
    { name: "students", max: 7258, start: 0 },
    { name: "teachers", max: 257, start: 0 },
    { name: "countries", max: 39, start: 0 },
  ];
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.timeInterval = setInterval(() => {
      this.counter = this.counter + 50;
      for (let item of this.milestones) {
        if (this.counter > item.max) {
          item.start = item.max;
        } else {
          item.start = this.counter;
        }
      }
    }, 30);
  }
  openScrollableContent(longContent) {
    this.modalService.open(longContent, { scrollable: true });
  }
}
