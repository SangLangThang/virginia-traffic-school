import { ComponentFixture, TestBed } from "@angular/core/testing";
import { click, findEls } from "../../../../testing/element.spec-helper";
import { PlanServicesService } from "../../shared/plan-services.service";

import { PlanComponent } from "./plan.component";
const mockData = [
  { price: "517", time: "year", features: Array(5) },
  { price: "697", time: "year", features: Array(5) },
  { price: "577", time: "year", features: Array(5) },
];
describe("PlanComponent", () => {
  let component: PlanComponent;
  let fixture: ComponentFixture<PlanComponent>;
  let planService: PlanServicesService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanComponent],
      providers: [PlanServicesService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanComponent);
    component = fixture.componentInstance;
    planService = TestBed.inject(PlanServicesService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should call onChangePrice", () => {
    let actualData =[]
    planService.pricingFeaturesChange.subscribe((data) => {
      actualData=data;
    });
    click(fixture, "changePriceToYear");
    expect(actualData[0].price).toEqual(mockData[0].price)
  });
});
