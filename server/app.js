var express = require('express'),
       jade = require('jade'),
        app = express.createServer();

app.configure(function() {
  app.set('views', __dirname + '/src');
  app.use(express.static(__dirname + '/res'));
});

// Need: 404 (i.e. error) template, gist template, base index template

// backed by some sort of database
//   probably easy to use Redis because it's only stored in RAM

app.get('/', function(req, res) {
  res.render('layout.jade')
  // TODO Route for "/" GET sends list of all "gists"
  // "partial" to iterate over "gists" from database results
});

/*
app.get('/:n([0-9]+)', function(req, res) {
  var n = req.params.n
  // TODO send to 404 if n not in db 
  // "gist" and back button
});

app.post('/', function(req, res) {
  // TODO Route for "/" POST tries to upload "gist"
  // use req.is to check for text/plain
  // process text, escape it and replace colors with span tags
  // put in db
  // afterward, redirect to new "gist" URL
});

app.error(function(err, req, res, next) {
  if(err instanceOf NotFound) {
    res.render('404.jade'); // this is how to send jade templates?
  } else {
    res.render('500.jade');
  }
});
*/

app.listen(3000);
