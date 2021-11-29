import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-timeline-item",
  templateUrl: "./timeline-item.component.html",
  styleUrls: ["./timeline-item.component.scss"],
})
export class TimelineItemComponent implements OnInit {
  @Input() timeline: { year: string; content: string; imageUrl: string };
  @Input() direction: string[];
  @Input() index: number;
  constructor() {
    this.timeline = { year: "", content: "", imageUrl: "" };
  }
  imgUrl: string;
  ngOnInit(): void {
    this.imgUrl = `background-image:url(${this.timeline.imageUrl}) ;`;
  }
}
