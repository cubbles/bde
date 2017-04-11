(function() {
  'use strict';
  var supportsES6 = function () {
    try {
      new Function ('(a = 0) => a');
      return true;
    } catch (e) {
      return false;
    }
  };

  function showBde () {
    document.querySelector('bde-app').style.display = 'block';
    document.querySelector('#index_spinner').parentNode.style.display = 'none';
    document.removeEventListener('cifIframeCrcReady', showBde);
  }

  if (supportsES6()) {
    document.addEventListener('cifIframeCrcReady', showBde);
  } else {
    window.location.assign("incompatibleBrowser.html")
  }
})();
