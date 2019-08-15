const express = require('express');
const path = require('path');
const router = require('express').Router();
const request = require('request');
const app = express();
const port = process.env.PORT || 5000;
const key = process.env.etsykey || process.env.etsyapikey;

let reqShop = function(id){
  let promise = new Promise((resolve, reject) => {
    const shopUrl = 'https://openapi.etsy.com/v2/shops/listing/' + id + '.js?api_key=' + key;
    request(shopUrl, {jsonp: true}, (err, response, body) => {
      if(err){reject(err);}
      body = JSON.parse(body.slice(5, (body.length-2)));
      resolve(body.results[0].shop_name);
    });
  })
  return promise;
};

let reqImage = function(id){
  let promise = new Promise((resolve, reject) => {
  const imageUrl = 'https://openapi.etsy.com/v2/listings/'+id+'/images.js?api_key='+key;
    request(imageUrl, {jsonp: true}, (err, response, body) => {
      if(err){reject(err);}
      body = JSON.parse(body.slice(5, (body.length-2)));
      resolve(body.results[0].url_170x135);
    });
  })
  return promise;
};

app.use('/', router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

//Get listing id's route
router.get('/listingids', async function(req, res) {
  let shops = new Map();
  let results = [];
  const artistName = req.query.artistName.replace(/s/g, '%20');
  const listingUrl = 'https://openapi.etsy.com/v2/listings/active.js?tags=' + artistName + '&api_key=' + key;
  request(listingUrl, {jsonp: true}, async (err, response, body) => {
    if(err){return console.log(err);}
    body = JSON.parse(body.slice(5, (body.length-2)));
    if(body.results.length < 6){
      for(let i = 0; i < body.results.length; i++){results.push(body.results[i].listing_id);}
    }
    else {
      results.push(body.results[0].listing_id, body.results[1].listing_id, body.results[2].listing_id, body.results[3].listing_id, body.results[4].listing_id, body.results[5].listing_id);
    }
    for(let i = 0; i < results.length; i++){
      let shopResult = await reqShop(results[i]), imgResult = await reqImage(results[i]);
      shops.set(shopResult, imgResult);
    }
    res.json([...shops]);
  })
});

app.listen(port, () => console.log('Listening on port ' + port));
