const express = require('express');
const path = require('path');
const router = require('express').Router();
const request = require('request');
const app = express();
const port = process.env.PORT || 5000;
const key = process.env.etsykey || process.env.etsyapikey;

let getListingIds = function(artist){
  let promise = new Promise((resolve, reject) =>{
    const listingUrl = 'https://openapi.etsy.com/v2/listings/active.js?tags=' + artist + '&api_key=' + key;
    request(listingUrl, {jsonp: true}, (err, response, body) => {
      if(err){reject(err);}
      body = JSON.parse(body.slice(5, (body.length-2)));
      let results = [];
      if(body.results.length < 6){
        for(let i = 0; i < body.results.length; i++){results.push(body.results[i].listing_id);}
      }
      else {
        results.push(body.results[0].listing_id, body.results[1].listing_id, body.results[2].listing_id, body.results[3].listing_id, body.results[4].listing_id, body.results[5].listing_id);
      }
      resolve(results);
    });
  })
  return promise;
};

let getShop = function(id){
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

let getImage = function(id){
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

//Get Shops Route
router.get('/shops', async function(req, res) {
  let shops = new Map();
  const artistName = req.query.artistName.replace(/s/g, '%20');
  let results = await getListingIds(artistName);
  for(let i = 0; i < results.length; i++){
    let shopResult = await getShop(results[i]), imgResult = await getImage(results[i]);
    shops.set(shopResult, imgResult);
  }
  res.json([...shops]);
});

app.listen(port, () => console.log('Listening on port ' + port));
