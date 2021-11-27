describe("User page", () => {
  before(() => {
    cy.visit("/dashboard/user");
    cy.get("[id='email']").type("test@gmail.com");
    cy.get("[id='password']").type("111111");
    cy.get("[data-cy=submit]").click();
    cy.url().should("include", "/dashboard/user");
  });

  it("LocalStorage should have userData", function () {
    let data = JSON.parse(localStorage.getItem("userData"));
    expect(data.email).equal("test@gmail.com");
  });
  it("should select option Busy of Status select", function () {
    cy.ngxSelect("status", 2);
  });
  it("should select option Visa of paymentMethod select ", function () {
    cy.ngxSelect("paymentMethod", 1);
  });
  it("should select option Paypal of paymentMethod select and clear ", function () {
    cy.ngxSelect("paymentMethod", "Paypal");
  });
  it("should select option Viet Nam of country select ", function () {
    cy.ngxSelect("country", "Viet Nam");
  });
  it("should change input text", function () {
    let userNameTextbox = cy.get("[data-cy=username]");
    userNameTextbox.clear().type("Nero");
    userNameTextbox.should("have.value", "Nero");
    userNameTextbox.clear().type("Testname");
    userNameTextbox.should("have.value", "Testname");
    userNameTextbox.clear().type("Cypress");
    userNameTextbox.should("have.value", "Cypress");
  });
  it("should change input avatar", function () {
    let inputFile = cy.get("[data-cy=avatar]");
    inputFile.attachFile({
      filePath: "../../src/assets/img/avatars/2.jpg",
    });
    inputFile.attachFile({
      filePath: "../../src/assets/img/avatars/3.jpg",
    });
    inputFile.attachFile({
      filePath: "../../src/assets/img/avatars/4.jpg",
    });
    inputFile.attachFile({
      filePath: "../../src/assets/img/avatars/5.jpg",
    });
  });

  it("should submit form and rerender data from server", function () {
    cy.ngxSelect("status", 0);
    cy.ngxSelect("paymentMethod", "Paypal");
    cy.ngxSelect("country", "Viet Nam");
    let userNameTextbox = cy.get("[data-cy=username]");
    userNameTextbox.clear().type("UserNero");
    let inputFile = cy.get("[data-cy=avatar]");
    inputFile.attachFile({
      filePath: "../../src/assets/img/avatars/3.jpg",
    });
    cy.get("[data-cy=submit").click();
    cy.wait(1000);
    cy.get('[data-testid="displayName"]').should("have.text", "UserNero");
    cy.wait(1000);
  });

  // protractor to cypress
 /*  it("should toggle `sidebar-show` body.class on `navbar-toggler` click", function () {
    cy.viewport(980, 768)
    cy.get('.navbar-toggler.d-lg-none').first().click()
    cy.get('body').should('have.class','sidebar-show')
    cy.get('.navbar-toggler').first().click()
    cy.get('body').should('not.have.class','sidebar-show')
  }); */
  
});
