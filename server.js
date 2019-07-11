const express = require('express');
const router = require('express').Router();
const request = require('request');
const app = express();
const api_key = 'qup7qb9q3l9j9cqzrsw0d0gm'

//Get listing id's route
router.get('/listingids', function(req, res) {
  const artistName = req.query.artistName.replace(/s/g, '%20');
  const listingUrl = 'https://openapi.etsy.com/v2/listings/active.js?tags=' + artistName + '&api_key=' + api_key;
  request(listingUrl, {jsonp: true}, (err, response, body) => {
    if(err){return console.log(err);}
    body = JSON.parse(body.slice(5, (body.length-2)));
    //console.log(body[0]);
    res.json(body.results[0].listing_id);
  })
});


/*
router.get('/shopnames', function(req, res) {
  const listingId = req.query.listingId;
  const shopUrl = 'https://openapi.etsy.com/v2/shops/listing/' + listingId + '.js?api_key=' + api_key
  res.json(listingId);
});*/

app.use('/', router);

app.listen(5000, () => console.log('Listening on port 5000'));
