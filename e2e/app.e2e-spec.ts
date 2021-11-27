import { by, element, ProtractorBrowser } from "protractor";
import { ProductsComponent } from "./app.po";

describe("App page", () => {
  //khai báo biến cần thiết
  let page: ProductsComponent;
  let browser: ProtractorBrowser;
  beforeEach(() => {
    //gán biến
    page = new ProductsComponent();
    browser = page.getBrowser();
    browser.driver.sleep(300);
    //navigate tới "/""
    page.navigateTo();
  });
  it("should navigate to products page when first run", async () => {
    //check nếu app navigate thành công
    expect(await browser.getCurrentUrl()).toEqual(
      "http://localhost:4200/products"
    );
  });
  it("should display the LivePreview button on mouseover", function () {
     // tạo một actions là di chuyển chuột tới element 
    browser
      .actions()
      .mouseMove(element(by.css("a[href='/smart-edu2'] img")))
      .perform();
    browser.driver.sleep(300);
    //xác nhận element đã hiển thị
    expect(
      element(by.css("a[href='/smart-edu2'].btn-success")).isDisplayed()
    ).toBeTruthy();
  });
  it("should navigate to Theme page when click LivePreview button ", async () => {
    browser
      .actions()
      .mouseMove(element(by.css("a[href='/smart-edu'] img")))
      .perform();
    browser.driver.sleep(300);
    //tìm tới element và click
    await element(by.css("a[href='/smart-edu'].btn-success")).click();
    browser.waitForAngular();
    browser.driver.getCurrentUrl().then(function (text) {
      console.log("current URL:", text);
    });
    expect(await browser.getCurrentUrl()).toEqual(
      "http://localhost:4200/smart-edu/home"
    );
  });
  it("should navigate to Login page when click dashboard button ", async () => {
    await page.getDashboardButtons().click();
    expect(await browser.getCurrentUrl()).toEqual(
      "http://localhost:4200/login"
    );
  });
});
