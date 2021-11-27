import { Injectable, TemplateRef } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
  showToast(mess: string, style: string, position: string) {
    this.show(mess, {
      classname: `${style} text-light ${position}`,
    });
  }
}
