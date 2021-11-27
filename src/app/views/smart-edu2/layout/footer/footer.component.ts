import { Component, OnInit } from "@angular/core";
import { social ,infomationLink, contactInfo} from "../../shared/shared";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  social = social;
  infomationLink = infomationLink;
  contactInfo = contactInfo
  constructor() {}

  ngOnInit(): void {}
}
