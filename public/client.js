(function($){
  $(document).ready(function(){

    $('button').click(function(){
      $('ul').empty();
      $('input').empty();
      let shops = [];
      const tag = $("[id='tag']").val();
      //Request to server
      $.ajax({
        url: '/listingids?artistName=' + tag,
        dataType: 'json',
        success: function(data) {
          if(data.length == 0)
            $('ul').append('Sorry, we were unable to find any sellers related to that artist!');
          for(let item of data){
            if(!shops.includes(item)){
              $('ul').append('<li>https://www.etsy.com/shop/'+item+'</li>');
              shops.push(item);
            }
          }
      }
    });
  })
});
})(jQuery);
