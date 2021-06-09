const express = require('express');
const app = express();
const shanten = require('./source/shanten.js');


const test_case = [
  1,1,1,0,0,0,0,0,0,// manzu
  0,1,0,1,1,0,2,0,1,// pinzu
  0,0,0,0,0,0,0,0,0,// souzu
  1,0,1,0,3,0,0// jihai
];

app.get('/', (req, res) => {
  console.log('Hello world received a request.');

  const result = shanten.shanten(test_case);
  console.log(result);

  const target = process.env.TARGET || 'World';
  res.send(`Hello ${target}!`);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Hello world listening on port', port);
});

