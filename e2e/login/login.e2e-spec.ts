import { browser, protractor } from "protractor";
import { LoginPage } from "./login.po";
describe("Login tests", () => {
  let page: LoginPage;
  browser.ignoreSynchronization = true;
  const EC = protractor.ExpectedConditions;
  beforeEach(() => {
    page = new LoginPage();
    page.navigateTo();
  });

  it("Login form should be valid", () => {
    page.getEmailTextbox().sendKeys("test@gmail.com");
    page.getPasswordTextbox().sendKeys("111111");
    let form = page.getForm().getAttribute("class");
    expect(form).toContain("ng-valid");
  });

  it("Login form should be invalid", () => {
    page.getEmailTextbox().sendKeys("");
    page.getPasswordTextbox().sendKeys("");
    let form = page.getForm().getAttribute("class");
    expect(form).toContain("ng-invalid");
  });

  it("App should navigate to the register page when the register button is clicked", function () {
    let btn = page.getRegisterButton();
    btn.click();

    browser.driver.getCurrentUrl().then(function (text) {
      console.log("current URL:", text);
    });
    expect(browser.getCurrentUrl()).toContain("/register");
  });
  it("App should navigate to the dashboard/user page when user login", function () {
    let btn = page.getLoginButton();
    page.getEmailTextbox().sendKeys("test@gmail.com");
    page.getPasswordTextbox().sendKeys("111111");
    btn.click();
    browser.driver.sleep(3000);
    browser.waitForAngular();
    browser.driver.getCurrentUrl().then(function (text) {
      console.log("current URL:", text);
    });
    expect(browser.getCurrentUrl()).toContain("/dashboard/user");
  });
  it("App should navigate to the dashboard/admin/manager page admin login", function () {
    let btn = page.getLoginButton();
    page.getEmailTextbox().sendKeys("admin@admin.com");
    page.getPasswordTextbox().sendKeys("111111");
    btn.click();
    browser.driver.sleep(2000);
    browser.waitForAngular();
    browser.driver.getCurrentUrl().then(function (text) {
      console.log("current URL:", text);
    });
    expect(browser.getCurrentUrl()).toContain("/dashboard/admin/manager");
  });
});
