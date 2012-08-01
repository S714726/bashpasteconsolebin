var express = require('express'),
       jade = require('jade'),
      redis = require('redis'),
        app = express(),
         db = redis.createClient();

app.use(app.router);
app.use(express.static(__dirname + '/res'));
app.set('views', __dirname + '/src');

// Need: 404 (i.e. error) template, gist template, base index template

app.get('/', function(req, res) {
  //db.zrange('dump', 0, -1);
  var test_logs = [{date:'07/31/2012', id:'112308123'}, {date:'08/01/2012', id:'01'}]
  res.render('index.jade', {logs: test_logs});
});

/*
app.get('/:n([0-9]+)', function(req, res) {
  var n = req.params.n
  // TODO send to 404 if n not in db 
  // "gist" and back button

res.render('log.jade', {
  title: 'log 123120983',
  message: 'log 123120983',
  content: '<p>$ command -> <span style=\"background-color: green;\">Coloring works</span></p><p>$ Use paragraphs for line breaks</p>'})
});

app.post('/', function(req, res) {
  // TODO Route for "/" POST tries to upload "gist"
  // use req.is to check for text/plain ?
  // process text, escape it and replace colors with span tags, line breaks with paragraphs
  // put in db
  // afterward, redirect to new "gist" URL
});
*/

/* Doesn't work at all.
app.error(function(err, req, res, next) {
  if(err instanceOf NotFound) {
    res.render('layout.jade', {title: '404: Page not found',
                               message: 'Page not found'});
  } else {
    res.render('layout.jade', {title: '500: Internal server error',
                               message: 'Internal server error'});
  }
});
*/

app.listen(3000);
