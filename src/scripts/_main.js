'use strict';

import $ from 'jquery';
import svg4everybody from 'svg4everybody';
import settings from './_settings';

$(document).ready(() => {

  
  // Preloader
  if(settings.preloader.enable) 
    $('.preloader').fadeOut(settings.preloader.delay);
  else
    $('.preloader').remove();


  // For correct load svg for all browsers
  svg4everybody();
  


});