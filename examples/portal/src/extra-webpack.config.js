// const WebpackAssetsManifest = require('webpack-assets-manifest');
// const PrefixWrap = require("postcss-prefixwrap");

// module.exports = {
//     optimization: {
//         runtimeChunk: false
//     },
//     plugins: [new WebpackAssetsManifest()],
//     module: {
//         rules: [
//              {
//                 test: /\.scss$/,
//                 use: [
//                     {
//                         loader:'postcss-loader',
//                         options: {
//                             plugins: [PrefixWrap(".portal")],
//                         }
//                     },
//                     'sass-loader'
//                 ]
//             }
//         ],
//     },
// };
