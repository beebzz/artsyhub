
  var api_key = 'qup7qb9q3l9j9cqzrsw0d0gm';
  //var url = 'https://openapi.etsy.com/v2/shops?api_key=' + api_key;
  var tag = 'Kanye';

  function printRes(json){
    console.log(json);
  }

  $.ajax({
    //type: 'GET',
    url: 'https://openapi.etsy.com/v2/listings/active?callback=manipulateData%tags=' + tag + '&api_key=' + api_key,
    dataType: 'jsonp',
    jsonpCallback: 'printRes'
  });

/*
var api_key = 'qup7qb9q3l9j9cqzrsw0d0gm';
//var url = 'https://openapi.etsy.com/v2/shops?api_key=' + api_key;

//function setTags(){tag = document.getElementById('artist').value; console.log(tag.toString())}

fetch('https://openapi.etsy.com/v2/listings/active.js?tags=' + tag + '&callback=handler&api_key=' + api_key, {method: 'get'})
//.then(handler)
.then(function(data){
  for(listing in data)
  {
    var listing_id = data.listing_id;
    return fetch('https://openapi.etsy.com/v2/shops/listing/' + listing_id + '.js?callback=handler&api_key=' + api_key, {method: 'get'})
  }
})
//.then(handler)
.then(function(data){
  console.log(data.shop_name);
})

function handler(data) {
  if(data.ok)
    return data.json();
    throw new Error(data.error);
}*/
