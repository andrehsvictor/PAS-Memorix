describe('Login Page', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.clearLocalStorage();
    });

    it('should display all page elements correctly', () => {
        cy.contains('h1', 'Bem-vindo de volta!');
        cy.contains('Acesse sua conta para continuar seus estudos');
        cy.get('img[alt="Memorix"]').should('be.visible');

        cy.get('label[for="email"]').should('contain', 'E-mail');
        cy.get('input#email').should('have.attr', 'placeholder', 'seu-email@exemplo.com');
        cy.get('input#password').should('have.attr', 'placeholder', '••••••••');

        cy.contains('button', 'Entrar').should('be.disabled');

        cy.contains('Ainda não tem uma conta?');
        cy.contains('a', 'Cadastre-se').should('have.attr', 'href', '/signup');

        cy.contains(`© ${new Date().getFullYear()} Memorix. Todos os direitos reservados.`);
    });

    it('should validate form inputs', () => {
        cy.contains('button', 'Entrar').should('be.disabled');

        cy.get('input#email').type('invalid-email');
        cy.get('input#email').blur();
        cy.get('input#password').type('password123');
        cy.contains('button', 'Entrar').should('be.disabled');

        cy.get('input#email').clear().type('valid@example.com');
        cy.get('input#password').clear().blur();
        cy.contains('button', 'Entrar').should('be.disabled');

        cy.get('input#email').clear().type('valid@example.com');
        cy.get('input#password').clear().type('password123');
        cy.contains('button', 'Entrar').should('not.be.disabled');
    });

    it('should show error message with invalid credentials', () => {
        const testUser = {
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
            password: btoa('correctpassword'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        cy.window().then((win) => {
            win.localStorage.setItem('users', JSON.stringify([testUser]));
        });

        cy.get('input#email').type('test@example.com');
        cy.get('input#password').type('wrongpassword');
        cy.contains('button', 'Entrar').click();

        cy.get('.bg-red-50.text-red-600').should('be.visible');
    });

    it('should login successfully with valid credentials', () => {
        const testUser = {
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
            password: btoa('correctpassword'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        cy.window().then((win) => {
            win.localStorage.setItem('users', JSON.stringify([testUser]));
        });

        cy.get('input#email').type('test@example.com');
        cy.get('input#password').type('correctpassword');
        cy.contains('button', 'Entrar').click();

        cy.url().should('include', '/');

        cy.window().then((win) => {
            expect(win.localStorage.getItem('user_id')).to.equal('123');
            expect(win.localStorage.getItem('auth_timestamp')).to.not.be.null;
        });
    });

    it('should navigate to signup page when clicking the signup link', () => {
        cy.contains('a', 'Cadastre-se').click();
        cy.url().should('include', '/signup');
    });

    it('should handle case insensitive email during login', () => {
        const testUser = {
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
            password: btoa('correctpassword'),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        cy.window().then((win) => {
            win.localStorage.setItem('users', JSON.stringify([testUser]));
        });

        cy.get('input#email').type('TEST@example.com');
        cy.get('input#password').type('correctpassword');
        cy.contains('button', 'Entrar').click();

        cy.url().should('include', '/');
    });
});