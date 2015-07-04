module.exports = function (babelObj) {

    var Plugin = babelObj.Plugin,
        t = babelObj.types,
        p = require('path');

    // Stolen from `require-parts`
    var extensions = /\.jsx?$/;
    function stripExtensions(filename) {
        if (extensions.test(filename)) {
            return stripExtensions(filename.replace(extensions, ''));
        }
        return filename;
    }

    // No formal tests!
    function mapper(module, intModulePath, intFiles) {
        var subModules = [];

        for (var i = 0, l = intFiles.length; i < l ; i++) {
            subModules.push(
                stripExtensions(intFiles[i].value) + ': ' +
                'require("' + p.join(module, intModulePath, intFiles[i].value) + '")'
            );
        }

        return '{' + subModules.join(",\n") + '}';
    }

    return new Plugin("require-parts-babel", {
        metadata: {
            group: "builtin-pre"
        },

        visitor: {
            CallExpression: function(node, parent, scope) {
                if (
                        node.callee &&
                        node.callee.callee &&
                        node.callee.callee.name == 'require' &&
                        node.callee.arguments[0].value == 'require-parts' &&
                        node.arguments.length >= 3
                    ) {
                    if (node.arguments[2].type !== 'ArrayExpression') {
                        throw new Error("The third argument of require-parts must be an array");
                    }
                    return this.replaceWithSourceString(
                    mapper(
                        node.arguments[0].value,
                        intModulePath = node.arguments[1].value,
                        intFiles = node.arguments[2].elements
                    ));
                }
            }
        }
    });
}
