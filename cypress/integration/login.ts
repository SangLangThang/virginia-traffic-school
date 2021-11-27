describe("Login page", () => {
  beforeEach(() => {
    cy.visit("/login");
  });
  it("form should be valid", () => {
    cy.get("[id='email']").type("test@gmail.com");
    cy.get("[id='password']").type("111111");
    cy.get("form").should("have.class", "ng-valid");
  });

  it("form should be invalid", () => {
    cy.get("[id='email']").type("333");
    cy.get("[id='password']").type("3324");
    cy.get("form").should("have.class", "ng-invalid");
  });

  it("should navigate to the register page when the register button is clicked", function () {
    cy.get("a[href='/register']").click()
    cy.url().should('include','/register')
  });
  it("should navigate to the dashboard/user page when user login", function () {
    cy.get("[id='email']").type("test@gmail.com");
    cy.get("[id='password']").type("111111");
    cy.get('[data-cy=submit]').click()
    cy.url().should('include','/dashboard/user')
  });
  it("should navigate to the dashboard/admin/manager page when user login", function () {
    cy.get("[id='email']").type("admin@admin.com");
    cy.get("[id='password']").type("111111");
    cy.get('[data-cy=submit]').click()
    cy.url().should('include','/dashboard/admin/manager')
  });
});
