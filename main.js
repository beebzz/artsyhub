const request = require('request');
const express = require('express');
const router = require('express').Router();
const app = express();
//const tag = 'kehlani';
const api_key = 'qup7qb9q3l9j9cqzrsw0d0gm'


/*request(url, {json: true}, (err, res, body) => {
  if(err){return console.log(err);}
  console.log(body);
});*/

//Example
router.get('/', function(req, res, next) {
  res.json('Testing');
});

//Get listing id's route
router.get('/listingids', function(req, res) {
  const artistName = req.query.artistName.replace(/s/g, '%20');
  const listingUrl = 'https://openapi.etsy.com/v2/listings/active.js?tags=' + artistName + '&api_key=' + api_key;
  request(listingUrl, {json: true}, (err, response, body) => {
    if(err){return console.log(err);}
    res.json(JSON.stringify(body));
  })
});

//Get shop names route
router.get('/shopnames', function(req, res) {
  const listingId = req.query.listingId;
  const shopUrl = 'https://openapi.etsy.com/v2/shops/listing/' + listingId + '.js?api_key=' + api_key
  res.json(listingId);
});

app.use('/', router);

app.listen(5000, () => console.log('Listening on port 5000'));
