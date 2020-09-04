(function($){
  $(document).ready(function(){
    $('#button').click(function(){
      $('ul').empty();
      $('h4').empty();
      $('input').empty();
      const tag = $("[id='tag']").val();
      //Request to back-end
      $.ajax({
        url: `/shops?artistName=${tag}`,
        dataType: 'json',
        success: function(data) {
          if(!data.length){
            $('ul').append(`<h4>Sorry, we were unable to find any sellers related to ${tag}!</h4>`);
          }
          else {
            $('.inner').prepend(`<h4>Here\'s a list of sellers on Etsy to buy some ${tag} merch from!</h4>`);
            for(let [shop, image] of data){
              $('ul').append(`<li><a href ="https://www.etsy.com/shop/${shop}">${shop}</a></li>`);
              $('ul').append(`<img src ="${image}"/>`);
            }
          }
      }
    });
  })
});
})(jQuery);
