import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-about-us",
  templateUrl: "./about-us.component.html",
  styleUrls: ["./about-us.component.scss"],
})
export class AboutUsComponent implements OnInit {
  courses = [0, 1548];
  students = [0, 7286];
  teachers = [0, 257];
  countries = [0, 39];
  timeInterval: any;
  counter = 0;
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.timeInterval = setInterval(() => {
      this.counter++
      if(this.courses[1] > this.counter){
        this.courses[0] ++ 
      }
      if(this.students[1] > this.counter){
        this.students[0] = this.counter 
      }
      if(this.teachers[1] > this.counter){
        this.teachers[0] = this.counter 
      }
      if(this.countries[1] > this.counter){
        this.countries[0] = this.counter 
      }
      if(this.counter > 1548) {
        clearInterval(this.timeInterval)
      }
    }, 1);
  }
  openScrollableContent(longContent) {
    this.modalService.open(longContent, { scrollable: true });
  }
}
