(function($){
  $(document).ready(function(){
    $('button').click(function(){
      $('ul').empty();
      $('h4').empty();
      $('input').empty();
      const tag = $("[id='tag']").val();
      const port = process.env.PORT;
      //Request to server
      $.ajax({
        url: 'http://localhost:'+port+'/listingids?artistName=' + tag,
        dataType: 'json',
        success: function(data) {
          for(let i = 0; i < data.length; i++)
          {
            $('ul').append('<li>https://www.etsy.com/shop/'+data[i]+'</li>');
          }
      }
    });
  })
});
});
