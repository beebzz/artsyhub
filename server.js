const express = require('express');
const path = require('path');
const router = require('express').Router();
const request = require('request');
const app = express();
const port = process.env.PORT || 5000;
const key = process.env.etsykey || process.env.etsyapikey;

/**
 * Query API for no more than 6 listings matching the artist/musician;
 * approach has room for reimagination (i.e. a load more button, pagination)
 */
const getListingIds = function(artist){
  const promise = new Promise((resolve, reject) =>{
    const listingUrl = `https://openapi.etsy.com/v2/listings/active.js?tags=${artist}&api_key=${key}`;
    request(listingUrl, {jsonp: true}, (err, response, body) => {
      if(err){reject(err);}
      body = JSON.parse(body.slice(5, (body.length-2)));
      let results = [];
      if(body.results.length < 6){
        for(const result of body.results){results.push(result.listing_id);}
      }
      else {
        for(let i = 0; i < 6; i++){results.push(body.results[i].listing_id);}
      }
      resolve(results);
    });
  })
  return promise;
};

/**
 * Obtain shops by the listing 
 */
const getShop = function(id){
  const promise = new Promise((resolve, reject) => {
    const shopUrl = `https://openapi.etsy.com/v2/shops/listing/${id}.js?api_key=${key}`;
    request(shopUrl, {jsonp: true}, (err, response, body) => {
      if(err){reject(err);}
      body = JSON.parse(body.slice(5, (body.length-2)));
      resolve(body.results[0].shop_name);
    });
  })
  return promise;
};

/**
 * Get item photos by shop and return the first one.
 * TODO: refactor to obtain images of listings found via
 * getListingIds
 */
const getImage = function(id){
  const promise = new Promise((resolve, reject) => {
  const imageUrl = `https://openapi.etsy.com/v2/listings/${id}/images.js?api_key=${key}`;
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

/**
 * Get shops route; existing approach has room for reimagination
 */
router.get('/shops', async function(req, res) {
  let shops = new Map();
  const artistName = req.query.artistName.replace(/s/g,'%20');
  const listingIds = await getListingIds(artistName);
  for(let id of listingIds){
    const shopResult = await getShop(id), imgResult = await getImage(id);
    shops.set(shopResult, imgResult);
  }
  res.json([...shops]);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
