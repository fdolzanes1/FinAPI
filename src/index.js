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

app.get('/account', (req, res) => {
  return res.status(200).send( { customers });
});

app.get('/statement', verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  return res.status(200).send( customer.statement );
});

app.get('/statement/date', verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  const { date } = req.query;

  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter( 
    (statement) => {
    statement.created_at.toDateString() === new Date(dateFormat).toDateString()
  });

  return res.status(200).send( customer );
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
    return res.status(400).send({ message: "Error: Insufficient Funds!"});
  }

  const statementOperation = {
    amount, 
    created_at: new Date(),
    type: "debit"
  }
  customer.statement.push(statementOperation);
  return res.status(201).send({ message: customer });
});

app.put('/account', verifyIfExistsAccountCPF,  (req, res) => {
  const { name } = req.body;
  const { customer } = req;

  customer.name = name;

  return res.status(200).send({ message: customer});
});

app.delete('/account', verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  customers.splice(customer, 1);
  return res.status(200).send({ message: customer});
})

app.listen(3000);