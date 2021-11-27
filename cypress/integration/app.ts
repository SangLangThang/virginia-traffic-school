describe("App", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("has the correct title", () => {
    cy.title().should("equal", "Virginia-Traffic School");
  });

  it("should navigate to products page when first run", () => {
    cy.url().should("include", "/products");
  });

  it("should navigate to theme page when click button", function () {
    cy.get("a[href='/smart-edu2'].btn-success").click({ force: true });
    cy.url().should("include", "/smart-edu2/home");
  });
  it("navigate to login page when click dashboard btn ", () => {
    cy.get('[data-testid="router-dashboard"]').click();
    cy.url().should("include", "/login");
  });
});
