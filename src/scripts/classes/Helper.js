var Helper = Object.create(null),
    H = Helper;

Helper.get = function(el) {
  var collection = document.querySelectorAll(el);

  this._collection = collection;

  return collection;
};

Helper.ready = function(callback) {
  if(document.readyState != 'loading') callback();
  else document.addEventListener('DOMContentLoaded', callback);
};

Helper.offset = function() {
  var rect = this.getBoundingClientRect();

  return {
    top: rect.top + pageYOffset,
    left: rect.left + pageXOffset
  };
};

Element.prototype.find = function(el) {
  return this.querySelectorAll(el);
};

Element.prototype.next = function() {
  return this.nextElementSibling;
};

Element.prototype.prev = function() {
  return this.previousElementSibling;
};

Element.prototype.remove = function() {
  this.parentNode.removeChild(this);
};

Element.prototype.type = function() {
  return Object.prototype.toString.call(this).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
};

Element.prototype.css = function(styles) {
  var objType = Object.prototype.toString.call(styles).replace(/^\[object (.+)\]$/, '$1').toLowerCase();

  switch(objType) {
    case 'object':
      var concatStyle = '';

      for(var key in styles) {
        concatStyle += key + ':' + styles[key] + ';';
      }

      this.style.cssText = concatStyle;
      break;

    case 'string':
      return getComputedStyle(this)[styles];
  }
};