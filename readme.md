## FinApi - Financeira

Api desenvolvida durante as aulas do primeiro capitulo do curso Rocketseat Ignite NodeJS.

Durante o desenvolvimento colocamos em pratica conceitos básicos de **CRUD**, **Validação**, **HTTP**, **Middleware** e **Express**.

---

### Como rodar o Projeto
```bash
    # Clonar o repositório
    $ git clone https://github.com/fdolzanes1/FinAPI

    # Entrar no diretório
    $ cd FinAPI

    # Instalar as dependências
    $ yarn install

    # Iniciar o projeto
    $ yarn start
```

### Testes
Originalmente o desenvolvimento feito nesse módulo não possuia testes, então implementei os testes com cobertura de 100% das respostas desenvolvidas.

```bash
    # Rodar Testes
    $ yarn test

    # Rodar Testes com Tabela de cobertura
    $ yarn jest --collect-coverage
```

### Requisitos

- [x] Deve ser possível criar uma conta
- [x] Deve ser possível buscar o extrato bancário do cliente
- [x] Deve ser possível realizar um depósito
- [ ] Deve ser possível realizar um saque
- [ ] Deve ser possível buscar o extrato bancário do cliente por data
- [ ] Deve ser possível atualizar dados da conta do cliente
- [ ] Deve ser possível obter dados da conta do cliente
- [ ] Deve ser possível deletar uma conta
- [ ] Deve ser possível retornar o balanço

---

### Regras de negócio

- [x] Não deve ser possível cadastrar uma conta com CPF já exístente
- [x] Não deve ser possível buscar extrato em uma conta não exístente
- [x] Não deve ser possível fazer depósito em uma conta não exístente
- [ ] Não deve ser possível fazer saque em uma conta não exístente
- [ ] Não deve ser possível fazer saque quando o saldo for insuficiente
- [ ] Não deve ser possível excluir uma conta não exístente

Sofware Developer: Fabiano Dolzanes