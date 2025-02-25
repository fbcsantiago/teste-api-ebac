/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'
describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    })

  });

  it('Deve listar usuários cadastrados - GET', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).should((response) => {
      expect(response.status).equal(200)
      expect(response.body).to.have.property('usuarios')
    })

  });

  it('Deve cadastrar um usuário com sucesso - POST', () => {
    let numero = Math.floor(Math.random() * 100000000);
    let nome = 'Fabio Silva ' + numero
    let email = 'fabiosilva' + numero + '@qa.com.br'
    cy.cadastrarUsuario(nome, email)
      .then((response) => {
        expect(response.status).equal(201)
        expect(response.body.message).equal('Cadastro realizado com sucesso')
      })

  });

  it('Deve validar um usuário com email inválido - POST', () => {

    let numero = Math.floor(Math.random() * 100000000);
    let nome = 'Fabio Silva ' + numero
    let email = 'fabiosilva' + numero + '@qa.com.br'
    cy.cadastrarUsuario(nome, email)
      .then((response) => {
        expect(response.status).equal(201)
        expect(response.body.message).equal('Cadastro realizado com sucesso')

        cy.cadastrarUsuario(nome, email)
          .then((response) => {
            expect(response.status).equal(400)
            expect(response.body.message).equal('Este email já está sendo usado')
          })
      })

  });

  it('Deve editar um usuário previamente cadastrado - PUT', () => {
    let numero = Math.floor(Math.random() * 100000000);
    let nome = 'Fabio Silva ' + numero
    let email = 'fabiosilva' + numero + '@qa.com.br'
    cy.cadastrarUsuario(nome, email)
      .then((response) => {
        expect(response.status).equal(201)
        let id = response.body._id
        cy.request({
          method: 'PUT',
          url: `usuarios/${id}`,
          body:
          {
            "nome": nome,
            "email": email,
            "password": "teste",
            "administrador": "true"
          }
        }).then(response => {
          expect(response.body.message).to.equal('Registro alterado com sucesso')
        })

      })
  });

  it('Deve deletar um usuário previamente cadastrado -DELETE', () => {
    let numero = Math.floor(Math.random() * 100000000);
    let nome = 'Fabio Silva ' + numero
    let email = 'fabiosilva' + numero + '@qa.com.br'
    cy.cadastrarUsuario(nome, email)
      .then((response) => {
        let id = response.body._id
        cy.request({
          method: 'DELETE',
          url: `usuarios/${id}`,
        }).should(response => {
          expect(response.body.message).to.equal('Registro excluído com sucesso')
          expect(response.status).equal(200)
        })

      })

  });


});
