const WebpackAssetsManifest = require('webpack-assets-manifest');
const PrefixWrap = require('@worktile/planet-postcss-prefixwrap');
// const PrefixWrap = require('postcss-prefixwrap');

module.exports = {
    optimization: {
        runtimeChunk: false
    },
    plugins: [new WebpackAssetsManifest()],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    PrefixWrap('.app1', {
                                        hasAttribute: 'planet-inline',
                                        prefixRootTags: true
                                    })
                                ]
                            }
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    }
};
