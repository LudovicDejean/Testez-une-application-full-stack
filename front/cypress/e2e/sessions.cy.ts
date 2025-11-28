describe('Sessions spec', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/teacher', {
      body: [
        {
          "id": 1,
          "lastName": "DELAHAYE",
          "firstName": "Margot",
          "createdAt": "2024-01-16T11:34:03",
          "updatedAt": "2024-01-16T11:34:03"
        },
        {
          "id": 2,
          "lastName": "THIERCELIN",
          "firstName": "Hélène",
          "createdAt": "2024-01-16T11:34:03",
          "updatedAt": "2024-01-16T11:34:03"
        }
      ]
    }).as('teachers')

    cy.intercept('GET', '/api/teacher/1', {
      body: [
        {
          "id": 1,
          "lastName": "DELAHAYE",
          "firstName": "Margot",
          "createdAt": "2024-01-16T11:34:03",
          "updatedAt": "2024-01-16T11:34:03"
        }
      ],
    })
  })

  it('add session', () => {
    cy.login('yoga@studio.com','test!1234');
    cy.get('[routerlink=create]').click();
    cy.url().should('include','/create');
    cy.get('input[formControlName=name]').type("yoga");
    cy.get('input[formControlName=date]').type('2024-02-12');
    cy.get('mat-select[formControlName=teacher_id]')
      .click()
      .get('mat-option')
      .contains('DELAHAYE')
      .click();

    cy.get('textarea[formControlName=description]').type("yoga");
    cy.intercept('POST', '/api/session', {
      body: {
        name: 'yoga',
        date: '2024-02-12',
        description: 'yoga',
        teacher_id: 1,
        users:[1]
      },
    })
    cy.get('[type=submit]').click();
    cy.url().should('include','/session');
  })
  it('edit and delete session', () => {
    cy.intercept('DELETE', '/api/session/1', {})
    cy.intercept('GET', '/api/session/1', {
      body: {
        name: 'yoga',
        date: new Date(),
        description: 'yoga',
        teacher_id: 1,
        users:[],
        createdAt: new Date(),
        updatedAt: new Date()
      },
    })
    cy.login('yoga@studio.com','test!1234')
    cy.get("button span").contains("Detail").first().click()
    cy.url().should('include', '/detail')
    cy.get("button span").contains("Delete").click()
  })
  it('participate session', () => {
    cy.intercept('GET', '/api/session/1', {
      body: {
        name: 'yoga',
        date: new Date(),
        description: 'yoga',
        teacher_id: 1,
        users: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
    })
    cy.login('test@test.com', 'test!1234');
    cy.get("button span").contains("Detail").first().click()
    cy.intercept('POST', '/api/session/1/participate/2', { })
    cy.intercept('GET', '/api/session/1', {
      body: {
        name: 'yoga',
        date: new Date(),
        description: 'yoga',
        teacher_id: 1,
        users: [2],
        createdAt: new Date(),
        updatedAt: new Date()
      },
    }).as("AfterParticipate")
    cy.get("button span").contains("Participate").first().click()
    cy.wait("@AfterParticipate")
  })
})
