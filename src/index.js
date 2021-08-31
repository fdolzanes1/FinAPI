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

//app.use(verifyIfExistsAccountCPF);

app.get('/statement', verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  return res.status(200).send({ message: customer });
});

app.listen(3000);