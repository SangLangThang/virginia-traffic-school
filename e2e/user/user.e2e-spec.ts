import { browser, by, element, protractor } from "protractor";
import { UserPage } from "./user.po";
let page: UserPage;
let testDropdown: (
  id: string,
  selected: number | string,
  clearOption?: boolean
) => void;
let waiting: (time: number) => void;
let path: any;

describe("User page", () => {
  testDropdown = async (
    id: string,
    selected: number | string,
    clearOption?: boolean
  ) => {
    //find dropdown
    let select = await page.getDropdownbyId(id);
    expect(select).toBeTruthy();
    select.click();
    waiting(1000);
    //find list option
    let options = page.getOptionList(select);

    expect(options).toBeTruthy();

    //selected option with type of selected
    if (typeof selected === "number") {
      options.get(selected).click();
    }
    if (typeof selected === "string") {
      let input = page.getDropdownInput(select);
      input.sendKeys(selected);
      browser.actions().sendKeys(protractor.Key.ENTER).perform();
      waiting(1000);
      let option = page.getOption(select);
      let text = await option.getText();
      expect(text).toBe(selected);
    }
    //check option show in UI
    let option = page.getOption(select);
    expect(option).toBeTruthy();
    if (clearOption) {
      let clearBtn = page.getClearOptionBtn(select);
      expect(clearBtn).toBeTruthy();
      clearBtn.click();
    }
  };
  waiting = (time: number) => {
    browser.driver.sleep(time);
    browser.waitForAngular();
  };
  beforeEach(() => {
    page = new UserPage();
    page.navigateTo();
    path = require("path");
  });
  it("LocalStorage should have userData", async function () {
    let userData = await browser.executeScript(
      "return window.localStorage.getItem('userData');"
    );
    expect(userData).toBeTruthy();
    waiting(1000);
  });
  it("Should select option Busy of Status select", async function () {
    testDropdown("status", 1, false);
    waiting(1000);
  });
  it("Should select option Visa of paymentMethod select and clear option", async function () {
    testDropdown("paymentMethod", 2, true);
    waiting(1000);
  });
  it("Should select option VietNam of Country select", async function () {
    testDropdown("country", "Viet Nam", false);
    waiting(1000);
  });

  it("should change input text", async function () {
    let textbox = page.getUserNameTextbox();
    textbox.click()
    textbox.clear();
    waiting(300);
    textbox.sendKeys("Testname");
    waiting(300);
    expect(await textbox.getAttribute("value")).toEqual("Testname");
  });

  it("should upload a file", function () {
    let fileToUpload = "../../src/assets/img/avatars/3.jpg",
      absolutePath = path.resolve(__dirname, fileToUpload);
    let inputFile = page.getInputFile();
    inputFile.sendKeys(absolutePath);
    waiting(1000);
  });

  it("should upload a form userData", async function () {

    let fileToUpload = "../../src/assets/img/avatars/3.jpg";
    let absolutePath = path.resolve(__dirname, fileToUpload);
    let inputFile = page.getInputFile();
    await inputFile.sendKeys(absolutePath);
    waiting(1000);

    testDropdown("status", 1, false);
    waiting(1000);

    testDropdown("country", "Viet Nam", false);
    waiting(1000);

    testDropdown("paymentMethod", 2, false);
    waiting(1000);

    let textbox = page.getUserNameTextbox();
    textbox.clear();
    textbox.click()
    waiting(300);
    textbox.sendKeys("Kute");
    waiting(300);
    expect(await textbox.getAttribute("value")).toEqual("Kute");

    let btnSubmit = page.getSubmitBtn();
    btnSubmit.click();

    waiting(5000);
  });
});
