function includeHTML() {
  var z, i, elmnt, files;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName('*');
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain attribute:*/
    files = elmnt.getAttribute('include-html');
    if (files) {
      files = files.split(',');
      /* Chain the requests in sequence using a callback function: */
      loadFilesInSequence(files, elmnt, function () {
        /* Remove the attribute: */
        elmnt.removeAttribute('include-html');
        /* Call the function again to include any remaining files: */
        includeHTML();
      });
      /* Exit the function: */
      return;
    }
  }
}

function loadFilesInSequence(files, elmnt, callback) {
  var i = 0;

  function next() {
    if (i < files.length) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.insertAdjacentHTML('afterend', this.responseText);
            i++;
            next();
          } else if (this.status == 404) {
            elmnt.insertAdjacentHTML('afterend', 'Page not found.');
            i++;
            next();
          }
        }
      };
      xhttp.open('GET', files[i], true);
      xhttp.send();
    } else {
      callback();
    }
  }

  next();
}

includeHTML();
