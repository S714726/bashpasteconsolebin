module.exports = {
  transform: function(str) {
    return bashColorize(htmlEscape(str));
  }
};

// Put in bright/bold support later
var normalColors = {
  '0': '000', '1': 'A00', '2': '0A0', '3': 'FF6', '4': '00A',
  '5': 'A0A', '6': '0AA', '7': 'FFF'
}

function htmlEscape(str) {
  return str.toString()
    .replace(new RegExp('&', 'gm'), '&amp;')
    .replace(new RegExp('\'', 'gm'), '&#39;')
    .replace(new RegExp('<', 'gm'), '&lt;')
    .replace(new RegExp('>', 'gm'), '&gt;')
    .replace(new RegExp('\"', 'gm'), '&quot;');
}

function bashColorize(str) {
  var colorized = '';
  var findColors = new RegExp('\\[([0-9][0-9]?;?)*m', 'gm');
  var sequences = [0];
  while ((match = findColors.exec(str)) != null) {
    sequences.push(match.index, findColors.lastIndex);
  }
  var colored = false;
  for (var i = 0; i < sequences.length; i+=2) {
    colorized += str.slice(sequences[i], sequences[i+1]);
    var colors = str.slice(sequences[i+1]+1,sequences[i+2]-1)
      .split(';');

    colors.forEach(function(color, ind, arr) {
      if (color == '0' && colored) {
        colorized += '</span>'
        colored = false;
      } else if (color[0] == '3' && color[1] in normalColors) {
        if (colored)
          colorized += '</span>'
        else
          colored = true;
        colorized += '<span style=\'color: #'
          + normalColors[color[1]] + '\'>';
      }
    });
  }
  if (colored)
    colorized += '</span>'
  return colorized;
}
