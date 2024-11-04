require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('node:dns');
dnsPromises = dns.promises;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const parser = bodyParser.urlencoded({
  extended: true
})
app.post('/api/shorturl', parser, function(req, res) {
  const isValidUrl = async urlString => {
    let url;
    try {
      url = new URL(urlString);
    }
    catch (e) {
      return false;
    }

    const validProtocol = url.protocol === "http:"
      || url.protocol === "https:";

    //TODO: this is not synchronous, parent function will not wait for it:
    let validHost = await dnsPromises.lookup(url.hostname)

    return validProtocol && validHost
  }
  console.log(isValidUrl(req.body.url))
  // console.log(req.body.url)
  // console.log(req.body)
  res.send(req.body)
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
