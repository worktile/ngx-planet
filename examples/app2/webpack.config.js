// const ngToolsWebpack = require('@ngtools/webpack');
// const path = require('path');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const ProgressPlugin = require('webpack/lib/ProgressPlugin');
// const workspaceRoot = path.resolve(__dirname, './');
// const projectRoot = path.resolve(__dirname, './');
// const {
//     IndexHtmlWebpackPlugin
// } = require('@angular-devkit/build-angular/src/angular-cli-files/plugins/index-html-webpack-plugin');
// const WebpackAssetsManifest = require('webpack-assets-manifest');

// const config = {
//     mode: 'development',
//     resolve: {
//         extensions: ['.ts', '.js']
//     },
//     context: projectRoot,
//     entry: {
//         main: path.resolve(projectRoot, './src/main.ts'),
//         polyfills: path.resolve(projectRoot, './src/polyfills.ts')
//     },
//     output: {
//         path: path.resolve(workspaceRoot, './dist'),
//         filename: `[name].js`,
//         libraryTarget: 'umd',
//         library: 'app2'
//     },
//     plugins: [
//         new WebpackAssetsManifest(),
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
//             { test: /\.scss$/, loaders: ['raw-loader', 'sass-loader'] },
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
//         port: 3002
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
