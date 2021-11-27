import { browser, by, element } from "protractor";
export class LoginPage {
  navigateTo() {
    return browser.get("/login");
  }
  getEmailTextbox() {
    return element(by.id("email"));
  }
  getPasswordTextbox() {
    return element(by.id("password"));
  }
  getForm() {
    return element(by.tagName("form"));
  }
  getLoginButton() {
    return element(by.buttonText("Login"));
  }
  getRegisterButton() {
    return element(by.tagName("a[href='/register']"));
  }
}
