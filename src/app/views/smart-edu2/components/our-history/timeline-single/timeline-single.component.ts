import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline-single',
  templateUrl: './timeline-single.component.html',
  styleUrls: ['./timeline-single.component.scss']
})
export class TimelineSingleComponent implements OnInit {
  @Input() timeline: { year: string; content: string; imageUrl: string };
  constructor() { }
  imgUrl: string;
  ngOnInit(): void {
    this.imgUrl = `background-image:url(${this.timeline?.imageUrl}) ;`;
  }

}
