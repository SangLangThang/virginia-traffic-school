import { Component, OnInit } from "@angular/core";
import {ScrollingModule} from '@angular/cdk/scrolling';

export interface FAQ {
  ques: string;
  ans: string;
}
@Component({
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.scss"],
})
export class FaqComponent implements OnInit {
  togglePanel: any[] = [];
  onTogglePanel(index: number) {
    if (this.togglePanel.includes(index)) {
      this.togglePanel = this.togglePanel.filter((x) => x != index);
      return;
    }
    this.togglePanel.push(index);
  }
  FAQs: FAQ[] = [
    {
      ques: "Why should I take a driver improvement course?",
      ans: "Completing a Virginia Driver Improvement Course can help you reduce points and fines associated with traffic tickets, lower your insurance rates, meet court requirements, or earn 5 Safe Driving points to your driving record.",
    },
    {
      ques: "Is this course approved by Virginia? ",
      ans: "Yes! Our course is approved by the Virginia DMV and meets all requirements for both point and fine reduction as well as insurance discounts and earning safe driving points.",
    },
    {
      ques: "Must I complete this driver improvement traffic school course in one sitting? ",
      ans: "No. You can log in and out of your account as much as you’d like. Your progress is automatically saved as you go. You will, however, need to spend a minimum of 8 hours on the course.",
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
