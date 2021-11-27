import { browser, by, element, ElementFinder, Locator } from "protractor";

export class UserPage {
  navigateTo() {
    return browser.get("/dashboard/user");
  }
  getUserNameTextbox() {
    return element(by.css(`[data-testid="username"]`));
  }
  getDisplayName() {
    return element(by.css(`[data-testid="displayName"]`));
  }

  getDropdownbyId(id: string) {
    return element(by.id(id));
  }
  getDropdownInput(element: ElementFinder) {
    return element.element(by.tagName("input"));
  }
  getOptionList(element: ElementFinder) {
    return element.element(by.tagName("ul")).all(by.tagName("li"));
  }
  getClearOptionBtn(element: ElementFinder) {
    return element.element(by.css(".ngx-select__clear"));
  }
  getOption(element: ElementFinder) {
    return element.element(by.css(".ngx-select__selected-single"));
  }
  getInputFile() {
    return element(by.id("avatar"));
  }
  getSubmitBtn() {
    return element(by.id("submit"));
  }
}
