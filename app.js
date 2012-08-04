var express = require('express'),
       jade = require('jade'),
      redis = require('redis'),
         fs = require('fs'),
        app = express(),
         db = redis.createClient(),
      utils = require('./src/bash_format');

app.use(express.bodyParser());
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
  var now = new Date().getTime();
  fs.readFile(req.files.log.path, function (err, data) {
    if (data) {
      var processed = utils.transform(data);
      db.zadd('logs', now, processed, function (err) {
        /* if (err) {
             // bomb
        }*/
        res.redirect('/' + now);
      });
    } /* else {} yet another bomb */
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
