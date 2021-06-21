const WebpackAssetsManifest = require('webpack-assets-manifest');
const PrefixWrap = require('@worktile/planet-postcss-prefixwrap');

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
                                    PrefixWrap('.portal', {
                                        blacklist: ['./reboot.scss'],
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
