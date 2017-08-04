'use strict';

import $ from 'jquery';
import svg4everybody from 'svg4everybody';

$(document).ready(() => {


  // Disabling the preloader
  $('#preloader').fadeOut(300);

  // For correct load svg for all browsers
  svg4everybody();
  

});