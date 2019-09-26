const WebpackAssetsManifest = require('webpack-assets-manifest');

module.exports = {
    optimization: {
        runtimeChunk: false
    },
    plugins: [new WebpackAssetsManifest()]
};
