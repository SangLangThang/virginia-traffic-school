import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastsContainer } from "./toasts-container.component";

@NgModule({
  declarations: [ToastsContainer],
  imports: [CommonModule, NgbModule],
  exports: [ToastsContainer],
})
export class ToastModule {}
