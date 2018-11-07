$(document).ready(function(){

  $(window).scroll(function(){
    if ($(this).scrollTop() > 10) {
     $('header').addClass('scrolling');
    } else {
     $('header').removeClass('scrolling');
    }
  });

  $('.scroll_to').click(function(e){
  	var jump = $(this).attr('href');
  	var new_position = $(jump).offset();
  	$('html, body').stop().animate({ scrollTop: new_position.top }, 700);
  	e.preventDefault();
  });


  $('.button-test, .overlay, .close').click(function(){
    $('.overlay').toggleClass('open');
    $('.complete').toggleClass('open');
    $('body').toggleClass('overflow-hidden');
  });

});
