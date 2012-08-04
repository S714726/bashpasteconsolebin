bashpasteconsolebin
==============
bashpasteconsolebin takes a console output directed to a file (most
likely recorded by `script(1)` or [youterm
script](https://github.com/quantumdream/yt-script) as an upload to the
server. Once there, it transforms it into an HTML-formatted page for
viewing. The result is a site that has many features in common with
(gist.github.com), but is obviously far more useful.

Still to come
-------------
1. Return genuine 404/500 responses from server
2. Expand shell escape code support: font styling (e.g. boldface),
   commands unrelated to formatting, and additional color changing
   (e.g. different background colors)
3. Utilize sessions for private storage and preserving settings (e.g.
   default terminal typeface and color scheme)
4. Write a script featuring automated console-to-server posting

License
-------
Copyright &copy; 2012 S714726

Inspiration from [@ericfode](https://github.com/ericfode)

Distributed under the GNU General Public License version 3.
