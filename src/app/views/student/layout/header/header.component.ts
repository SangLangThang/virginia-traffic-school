import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from "@angular/core";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  productInfo = {
    phone: "(800)-932-6813",
    email: "virginia@cheapeasyfast.com",
  };
  toggleMenuMobile = false;
  canToggle = false;
  @ViewChildren("link") listLinkRef: QueryList<any>;
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.handleResize();
  }
  ngAfterViewInit() {
    let listLinkRefArray = this.listLinkRef.toArray();
    listLinkRefArray.forEach((linkRef: ElementRef) => {
      this.renderer.listen(linkRef.nativeElement, "click", (event) => {
        if (this.canToggle) {
          this.toggleMenuMobile = !this.toggleMenuMobile;
        }
      });
    });
  }

  handleResize() {
    const match = window.matchMedia("(max-width: 991px)");
    this.canToggle = match.matches;
    match.addEventListener("change", (e) => {
      this.canToggle = e.matches;
    });
  }
}
