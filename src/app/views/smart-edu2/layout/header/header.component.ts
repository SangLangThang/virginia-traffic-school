import { BreakpointObserver } from "@angular/cdk/layout";
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { navLinks, productInfo } from "../../shared/shared";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  navLinks = navLinks;
  toggleMenuMobile = false;
  canToggle = false;
  @ViewChildren("link") listLinkRef: QueryList<any>;
  destroyed = new Subject<void>();
  constructor(
    private renderer: Renderer2,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(["(max-width: 991px)"])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        console.log(result);
        this.canToggle = result.matches;
      });
  }
  ngAfterViewInit() {
    let listLinkRefArray = this.listLinkRef.toArray();
    listLinkRefArray.forEach((linkRef: ElementRef) => {
      this.renderer.listen(linkRef.nativeElement, "click", () => {
        if (this.canToggle) {
          this.toggleMenuMobile = !this.toggleMenuMobile;
        }
      });
    });
  }
  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
