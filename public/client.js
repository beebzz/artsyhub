(function($){
  $(document).ready(function(){
    $('#button').click(function(){
      $('ul').empty();
      $('h4').empty();
      $('input').empty();
      const tag = $("[id='tag']").val();
      //Request to server
      $.ajax({
        url: '/listingids?artistName=' + tag,
        dataType: 'json',
        success: function(data) {
          if(data.length == 0)
            $('ul').append('<h4>Sorry, we were unable to find any sellers related to '+tag+'!</h4>');
          else
            $('.inner').prepend('<h4>Here\'s a list of sellers on Etsy to buy some '+tag+' merch from!</h4>');
          for(let item of data)
              $('ul').append('<li><a href ="https://www.etsy.com/shop/'+item+'">https://www.etsy.com/shop/'+item+'</a></li>');
      }
    });
  })
});
})(jQuery);
