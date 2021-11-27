import { Component, OnInit } from '@angular/core';
import { partners } from '../../shared/shared';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit {
  partners = partners
  constructor() { }

  ngOnInit(): void {
  }

}
