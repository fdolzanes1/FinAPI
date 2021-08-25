const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan());
app.use('/', (req,res) => {
  res.status(200).send({ message: "Hello" });
});
app.listen(3000);