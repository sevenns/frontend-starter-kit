/*
*   P R E L O A D E R
*/

if(SETTINGS.preloader.enable) {
  $(window).on('load', function() {
    $('.preloader').delay(500).fadeOut(SETTINGS.preloader.fadeDuration);
  });
} else {
  $('.preloader').remove();
}

/*
*   M A I N
*/

$(document).ready(function() {



  svg4everybody();



});