const express = require('express');
const path = require('path');
const router = require('express').Router();
const request = require('request');
const app = express();
const { apikey } = require('./config');
const { myport } = require('./config');


let shopReq = function(id){
  let promise = new Promise((resolve, reject) => {
    const shopUrl = 'https://openapi.etsy.com/v2/shops/listing/' + id + '.js?api_key=' + apikey;
    request(shopUrl, {jsonp: true}, (err, response, body) => {
      if(err){reject(err);}
      body = JSON.parse(body.slice(5, (body.length-2)));
      resolve(body.results);
    });
  })
  return promise;
};

app.use(express.static(path.join(__dirname, 'public')));

//Get listing id's route
router.get('/listingids', function(req, res) {
  let shopUrls = [];
  let results = [];
  const artistName = req.query.artistName.replace(/s/g, '%20');
  const listingUrl = 'https://openapi.etsy.com/v2/listings/active.js?tags=' + artistName + '&api_key=' + apikey;
  request(listingUrl, {jsonp: true}, (err, response, body) => {
    if(err){return console.log(err);}
    body = JSON.parse(body.slice(5, (body.length-2)));
    if(body.results.length < 6)
    {
      for(let i = 0; i < body.results.length; i++)
      {
        results.push(body.results[i].listing_id);
      }
    }
    else {
      results.push(body.results[0].listing_id, body.results[1].listing_id, body.results[2].listing_id, body.results[3].listing_id, body.results[4].listing_id, body.results[5].listing_id);
    }
    for(let i = 0; i < results.length; i++)
    {
      shopUrls.push(shopReq(results[i]));
    }
    Promise.all(shopUrls).then(shopUrls => res.json(shopUrls.map(item => item[0].shop_name)));
  })
});

app.use('/', router);

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

app.listen(myport);
