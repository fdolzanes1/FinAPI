const express = require('express');
const app = express();
const morgan = require('morgan');
const { v4:uuidv4 } = require('uuid'); 
app.use(morgan());
app.use(express.json());

const customers = [];

function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;
  const customer = customers.find( (customer) => customer.cpf === cpf);

  if (!customer) {
    return res.status(404).send({ message: 'Customer not found' });
  }
  req.customer = customer;
  return next();
}

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if(operation.type == "credit") {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, 0);
  return balance;
}

app.post('/account', (req, res) => {
  const { cpf, name } = req.body;

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return res.status(400).send({ error: "Customer Already Exists!"});
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: []
  });
  return res.status(201).send({ message: "Ok" });
});

app.get('/customer/', (req, res) => {
  return res.status(200).send( { customers });
});


app.post('/deposit', verifyIfExistsAccountCPF, (req, res) => {
  const { description, amount } = req.body;
  const { customer } = req;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  }

  customer.statement.push(statementOperation);
  return res.status(201).send({ message: customer });
});

app.post('/withdraw', verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  const { amount } = req.body;
  const  balance  = getBalance(customer.statement);

  if ( balance < amount ) { 
    return res.status(400).send({ message: "Insufficient Funds!"});
  }

  const statementOperation = {
    amount, 
    created_at: new Date(),
    type: "debit"
  }
  customer.statement.push(statementOperation);
  return res.status(201).send({ message: customer });
});

app.listen(3000);