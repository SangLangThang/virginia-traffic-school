// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

declare namespace Cypress {
  interface Chainable {
    /**
     * Get one or more DOM elements by test id.
     *
     * @param id The test id
     * @param options The same options as cy.get
     */
    byTestId<E extends Node = HTMLElement>(
      id: string,
      options?: Partial<
        Cypress.Loggable &
          Cypress.Timeoutable &
          Cypress.Withinable &
          Cypress.Shadow
      >
    ): Cypress.Chainable<JQuery<E>>;
  }
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    dataCy<E extends Node = HTMLElement>(
      value: string
    ): Cypress.Chainable<JQuery<E>>;
  }
  interface Chainable {
    /**
     * Custom command to select option element by data-cy attribute from ngx select.
     * @param idNgxSelect The test id
     * @param selected Option selected, number or string
     * @example cy.ngxSelect('status',2,false)
     */
    ngxSelect(
      idNgxSelect: string,
      selected: number | string
    ): void;
  }
}

Cypress.Commands.add(
  "byTestId",
  // Borrow the signature from cy.get
  <E extends Node = HTMLElement>(
    id: string,
    options?: Partial<
      Cypress.Loggable &
        Cypress.Timeoutable &
        Cypress.Withinable &
        Cypress.Shadow
    >
  ): Cypress.Chainable<JQuery<E>> => cy.get(`[data-testid="${id}"]`, options)
);
Cypress.Commands.add(
  "dataCy",
  <E extends Node = HTMLElement>(
    value: string
  ): Cypress.Chainable<JQuery<E>> => {
    return cy.get(`[data-cy=${value}]`);
  }
);
Cypress.Commands.add(
  "ngxSelect",
  (idNgxSelect: string, selected: number | string) => {
    cy.get(`[data-cy=${idNgxSelect}]`)
      .should('be.visible')
      .click()
      .within(($select) => {
        if (typeof selected === "number") {
          cy.get("ul").children("li").eq(selected).click();
        }
        if (typeof selected === "string") {
          cy.get("input").type(selected)
          cy.get("ul").children("li").eq(0).should('be.visible').click();
        }
        cy.wait(1000);
      });
  }
);
