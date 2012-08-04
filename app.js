var express = require('express'),
       jade = require('jade'),
      redis = require('redis'),
         fs = require('fs'),
        app = express(),
         db = redis.createClient();

app.use(express.bodyParser());
app.use(express.static(__dirname + '/res'));
app.set('views', __dirname + '/src');

// Put in bright/bold support later
var normalColors = {
  '0': '000', '1': 'A00', '2': '0A0', '3': 'FF6', '4': '00A',
  '5': 'A0A', '6': '0AA', '7': 'FFF'
}

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
  // process text, escape it and replace colors with span tags, line breaks with paragraphsw
      var htmlEscaped = data.toString()
        .replace(new RegExp('&', 'gm'), '&amp;')
        .replace(new RegExp('\'', 'gm'), '&#39;')
        .replace(new RegExp('<', 'gm'), '&lt;')
        .replace(new RegExp('>', 'gm'), '&gt;')
        .replace(new RegExp('\"', 'gm'), '&quot;');
      var processed = '';
      var findColors = new RegExp('\\[([0-9][0-9]?;?)*m', 'gm');
      var sequences = [0];
      while ((match = findColors.exec(htmlEscaped)) != null) {
        sequences.push(match.index, findColors.lastIndex);
      }
      var colored = false;
      for (var i = 0; i < sequences.length; i+=2) {
        processed += htmlEscaped.slice(sequences[i], sequences[i+1]);
        var colors = htmlEscaped.slice(sequences[i+1]+1,sequences[i+2]-1)
          .split(';');

        colors.forEach(function(color, ind, arr) {
          if (color == '0' && colored) {
            processed += '</span>'
            colored = false;
          } else if (color[0] == '3' && color[1] in normalColors) {
            if (colored)
              processed += '</span>'
            else
              colored = true;
            processed += '<span style=\'color: #'
              + normalColors[color[1]] + '\'>';
          }
        });
      }
      if (colored)
        processed += '</span>'
    db.zadd('logs', now, processed, function (err) {
      res.redirect('/' + now);/*
                                if (err) {
                                // bomb
                                }*/
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
