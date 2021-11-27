import { browser, by, element } from "protractor";

export class ProductsComponent {
  getBrowser() {
    return browser;
  }
  navigateTo() {
    return browser.get("/");
  }
  getDashboardButtons() {
    return element(by.css(`[data-testid="router-dashboard"]`));
  }
}
