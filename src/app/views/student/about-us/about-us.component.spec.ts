import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AboutUsComponent } from "./about-us.component";
export class MockNgbModalRef {
  componentInstance = {
    prompt: undefined,
    title: undefined,
  };
}
describe("AboutUsComponent", () => {
  let component: AboutUsComponent;
  let fixture: ComponentFixture<AboutUsComponent>;
  let ngbModal: NgbModal;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutUsComponent],
    }).compileComponents();
    ngbModal = TestBed.inject(NgbModal);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should open modal", () => {
    let content = "testing";
    spyOn(ngbModal, "open").and.returnValue(mockModalRef as any);
    component.openScrollableContent(content);
    expect(ngbModal.open).toHaveBeenCalled();
  });
});
