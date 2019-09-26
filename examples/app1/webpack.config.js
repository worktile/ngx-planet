// const ngToolsWebpack = require('@ngtools/webpack');
// const path = require('path');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const ProgressPlugin = require('webpack/lib/ProgressPlugin');
// const workspaceRoot = path.resolve(__dirname, './');
// const projectRoot = path.resolve(__dirname, './');
// const {
//     IndexHtmlWebpackPlugin
// } = require('@angular-devkit/build-angular/src/angular-cli-files/plugins/index-html-webpack-plugin');
// const RawCssLoader = require('@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader').default;
// const WebpackAssetsManifest = require('webpack-assets-manifest');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// const devMode = process.env.NODE_ENV !== 'production';

// const config = {
//     mode: 'development',
//     context: projectRoot,
//     resolve: {
//         extensions: ['.ts', '.js']
//     },
//     entry: {
//         main: path.resolve(projectRoot, './src/main.ts'),
//         polyfills: path.resolve(projectRoot, './src/polyfills.ts')
//     },
//     output: {
//         path: path.resolve(workspaceRoot, './dist'),
//         filename: `[name].[hash:20].js`,
//         libraryTarget: 'umd',
//         library: 'app1'
//     },
//     plugins: [
//         new WebpackAssetsManifest(),
//         new MiniCssExtractPlugin({
//             // Options similar to the same options in webpackOptions.output
//             // both options are optional
//             filename: devMode ? '[name].css' : '[name].[hash].css',
//             chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
//         }),
//         new ngToolsWebpack.AngularCompilerPlugin({
//             tsConfigPath: path.resolve(projectRoot, './src/tsconfig.app.json'),
//             mainPath: path.resolve(projectRoot, './src/main.ts'),
//             hostReplacementPaths: {
//                 './src/environments/environment.ts': './src/environments/environment.prod.ts'
//             },
//             sourceMap: true,
//             compilerOptions: {}
//         }),
//         new IndexHtmlWebpackPlugin({
//             input: path.resolve(__dirname, './src/index.html'),
//             output: path.basename('./src/index.html')
//             // baseHref: buildOptions.baseHref,
//             // entrypoints: generateEntryPoints(buildOptions),
//             // deployUrl: buildOptions.deployUrl,
//             // sri: buildOptions.subresourceIntegrity
//         }),
//         // new HtmlWebpackPlugin({
//         //     filename: 'src/index.html'
//         // })
//         new ProgressPlugin()
//     ],
//     module: {
//         rules: [
//             // {
//             //     test: /\.(sa|sc|c)ss$/,
//             //     use: [
//             //         devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
//             //         'css-loader',
//             //         'postcss-loader',
//             //         'sass-loader'
//             //     ]
//             // },
//             // {
//             //     test: /\.scss$/,
//             //     include: path.resolve(projectRoot, './src/styles.scss'),
//             //     loaders: [
//             //         MiniCssExtractPlugin.loader,
//             //         'css-loader',
//             //         // RawCssLoader,
//             //         {
//             //             loader:'postcss-loader',
//             //             options: {
//             //                 ident: "extracted",
//             //                 sourceMap: true
//             //             }
//             //         },
//             //         'sass-loader'
//             //     ]
//             // },
//             { test: /\.css$/, loader: 'raw-loader' },
//             { test: /\.html$/, loader: 'raw-loader' },
//             {
//                 // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
//                 // Removing this will cause deprecation warnings to appear.
//                 test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
//                 parser: { system: true }
//             },
//             // require.resolve is required only because of the monorepo structure here.
//             {
//                 test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
//                 // test: /\.ts$/,
//                 loader: require.resolve('@ngtools/webpack')
//             }
//         ]
//     },
//     devServer: {
//         historyApiFallback: true,
//         port: 3001
//     },
//     watch: true
// };

// const assets = ['favicon.ico', 'assets/'];
// const copyWebpackPluginPatterns = assets.map(asset => {
//     return {
//         from: `src/${asset}`,
//         to: asset.includes('.') ? '' : asset
//     };
// });
// const copyWebpackPluginOptions = {
//     ignore: ['.gitkeep', '**/.DS_Store', '**/Thumbs.db']
// };

// const copyWebpackPluginInstance = new CopyWebpackPlugin(copyWebpackPluginPatterns, copyWebpackPluginOptions);
// config.plugins.push(copyWebpackPluginInstance);

// module.exports = config;
