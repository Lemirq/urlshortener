require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('dns')
const { readFileSync, writeFileSync } = require('fs')

app.use(bodyParser.urlencoded({ extended: false }))

// Basic Configuration
const port = process.env.PORT || 3000;


app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

const path = './sitelist.json'
const jsonString = readFileSync(path);
const parsedSitelist = JSON.parse(jsonString)
console.log(parsedSitelist)

Object.keys(parsedSitelist).forEach((item, i) => {
  console.log(item)
})

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url

  dns.lookup(url, { all: true }, (err, addresses) => {
    if (err) {
      console.log(err)
    }
    if (addresses) {
      parsedSitelist[2] = { hello: "there" }
      console.log('length', parsedSitelist.length)
      writeFileSync(path, JSON.stringify(parsedSitelist), 'utf-8')


    }
    else {
      res.json({ error: "Invalid URL" })
    }
  })
})

app.post('/api/shorturl/:num', (req, res) => {
  console.log(req.params.num)
  res.json(req.params)
})