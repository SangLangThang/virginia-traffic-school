import { Component, TemplateRef } from "@angular/core";
import { ToastService } from "./toast.service";

@Component({
  selector: "app-toasts",
  template: `
    <ngb-toast
      *ngFor="let toast of toastService.toasts"
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 2000"
      (hidden)="toastService.remove(toast)"
    >
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
      </ng-template>

      <ng-template #text>{{ toast.textOrTpl }}</ng-template>
    </ngb-toast>
  `,
  //host: { "[class.ngb-toasts]": "true" },
  styles: [
    ".toast-bottom-left { margin: 0.5em;position: fixed;left: 0;bottom: 60px;z-index: 1200; }",
    ".toast-top-left { margin: 0.5em;position: fixed;left: 0;top: 0;z-index: 1200; }",
    ".toast-top-right { margin: 0.5em;position: fixed;right: 0;top: 0;z-index: 1200; }",
    ".toast-bottom-right { margin: 0.5em;position: fixed;right: 0;bottom: 60px;z-index: 1200; }",
  ],
})
export class ToastsContainer {
  constructor(public toastService: ToastService) {}

  isTemplate(toast) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
