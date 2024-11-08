/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'
describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response =>{
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
    cy.cadastrarUsuario('Fabio Silva da Costa', 'fsccosta5@qa.com.br')
      .then((response) => {
        expect(response.status).equal(201)
        expect(response.body.message).equal('Cadastro realizado com sucesso')
      })

  });

  it('Deve validar um usuário com email inválido - POST', () => {
    cy.cadastrarUsuario('Fabiana Bahia', 'fbahia@qa.com.br')
      .then((response) => {
        expect(response.status).equal(400)
        expect(response.body.message).equal('Este email já está sendo usado')
      })
  });

  it('Deve editar um usuário previamente cadastrado - PUT', () => {
    let nome = 'Fabio_' + Math.floor(Math.random() * 100000000)
    cy.cadastrarUsuario(nome, nome  + '@qa.com.br')
      .then((response) => {
        expect(response.status).equal(201)
        let id = response.body._id
        cy.request({
          method: 'PUT',
          url: `usuarios/${id}`,
          body:
          {
            "nome": nome,
            "email": nome  + '@qa.com.br',
            "password": "teste",
            "administrador": "true"
          }
        }).then(response => {
          expect(response.body.message).to.equal('Registro alterado com sucesso')
        })

      })
  });

  it('Deve deletar um usuário previamente cadastrado -DELETE', () => {
    let nome = 'Fabio_' + Math.floor(Math.random() * 100000000)
    cy.cadastrarUsuario(nome, nome  + '@qa.com.br')
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
