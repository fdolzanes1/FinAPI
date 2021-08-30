const express = require('express');
const app = express();
const morgan = require('morgan');
const { v4:uuidv4 } = require('uuid'); 
app.use(morgan());
app.use(express.json());

const customers = [];

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


app.listen(3000);