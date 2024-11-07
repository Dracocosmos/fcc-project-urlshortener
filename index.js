require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('node:dns');
const { resolve } = require('node:path');
const { error } = require('node:console');
dnsPromises = dns.promises;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// this should probably be a class
let urlList = {};
let curId = 0;
const getSetShortUrl = (url) => {
  // if already found, return
  if (urlList[url]) {
    return urlList[url]
  }

  // increment id
  curId++

  // set id
  urlList[url] = curId

  // return Id
  return urlList[url]
}

const parser = bodyParser.urlencoded({
  extended: true
})
app.post('/api/shorturl', parser, function(req, res) {
  // check if url valid by exercise standards, errors if invalid
  const isValidUrl = async urlString => {
    const url = new URL(urlString);

    if (!(url.protocol !== "http:" || url.protocol !== "https:")) {
      throw Error('invalid protocol')
    }

    await dnsPromises.lookup(url.hostname)

    return url
  }

  isValidUrl(req.body.url)
    .then(
      value => {
        console.log('value', value)
        console.log(req.body)
        res.json({
          original_url: value.origin,
          short_url: getSetShortUrl(value.origin)
        })
      }
    ).catch(
      error => {
        console.log(error)
        res.json({ error: 'invalid url' })
      }
    )
});

app.get('/api/shorturl/*', function(req, res) {

  res.send('hi')
  //TODO:
  // res.render('')
})



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
