var express = require('express'),
       jade = require('jade'),
      redis = require('redis'),
        app = express(),
         db = redis.createClient();

app.use(app.router);
app.use(express.static(__dirname + '/res'));
app.set('views', __dirname + '/src');

// Need: 404 (i.e. error) template

app.get('/', function(req, res) {
  db.zrevrange('logs', 0, -1, 'withscores', function (err, data) {
    if (data) {
      var logs = []
      for (i = 0; i < data.length; i += 2) {
        logs[i/2] = {id: parseInt(data[i+1], 10), content: data[i]}
      }
      res.render('index.jade', {logs: logs});
    } /*else {
      // 500 error, next() ?
      }*/
  });
});

app.get('/:n([0-9]+)', function(req, res) {
  var n = parseInt(req.params.n, 10);
  db.zrangebyscore('logs', n, n+1, 'withscores', 'limit', 0, 1, function (err, data) {
    if (data) {
      res.render('log.jade', {
        title: 'log ' + data[1],
        message: data[1],
        content: data[0]});
    } /*else {
      // TODO send to 404 if n not in db 
        }*/
  });
});


app.post('/', function(req, res) {
  // use req.is to check for text/plain ?
  var data = req.body.log; // find a one-liner that does this
  var now = new Date().getTime();
  var processed = data;
  // process text, escape it and replace colors with span tags, line breaks with paragraphs
  db.zadd('logs', now, processed, function (err) {
    res.redirect('/' + now);
/*
    if (err) {
      // bomb
    }*/
  });
});

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
