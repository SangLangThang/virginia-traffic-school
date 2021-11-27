import { Component, OnInit } from "@angular/core";
import { mileStones } from "../../shared/shared";

@Component({
  selector: "app-milestones",
  templateUrl: "./milestones.component.html",
  styleUrls: ["./milestones.component.scss"],
})
export class MilestonesComponent implements OnInit {
  mileStones = mileStones;
  constructor() {}

  ngOnInit(): void {}
}
