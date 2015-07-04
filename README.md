# RequirePartsBabel

Babel transformation related to [require-parts](https://github.com/forbesmyester/require-parts.git) that does that converts the:

    var R = requireParts('ramda', 'src', ['zipObj.js', 'min.js']);

into:

    var R = {
        assocPath: require('ramda/src/zipObj.js'),
        defaultTo: require('ramda/src/min.js')
    };

At the moment this is nothing too special and it returns a string which [@sebmck](https://twitter.com/sebmck) says is bad. I'll try and figure this out some other day as the sun is shining outside!
