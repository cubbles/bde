(function () {
  'use strict';
  var supportsES6 = function () {
    try {
      eval('var foo = (x)=>x+1'); // eslint-disable-line no-eval
      return true;
    } catch (e) {
      return false;
    }
  };

  function showBde () {
    document.querySelector('#site-load_spinner').style.display = 'none';
    document.removeEventListener('cifIframeCrcReady', showBde);
  }

  if (supportsES6()) {
    document.addEventListener('cifIframeCrcReady', showBde);
  } else {
    window.location.assign('incompatibleBrowser.html');
  }
})();
