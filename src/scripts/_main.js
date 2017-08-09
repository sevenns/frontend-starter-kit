'use strict';

import $ from 'jquery';
import svg4everybody from 'svg4everybody';
import settings from './_settings';

// Preloader
if(settings.preloader.enable) {
  $(window).on('load', function() {
    $('.preloader').delay(500).fadeOut(settings.preloader.delay);
  });
}
else
  $('.preloader').remove();

$(document).ready(() => {



  // For correct load svg for all browsers
  svg4everybody();
  


});