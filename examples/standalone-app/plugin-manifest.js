const manifestPlugin = require('esbuild-plugin-manifest');

module.exports = manifestPlugin({
    filename: 'assets-manifest.json'
});
