const ngToolsWebpack = require('@ngtools/webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const workspaceRoot = path.resolve(__dirname, './');
const projectRoot = path.resolve(__dirname, './');
const {
    IndexHtmlWebpackPlugin
} = require('@angular-devkit/build-angular/src/angular-cli-files/plugins/index-html-webpack-plugin');
const {
    SuppressExtractedTextChunksWebpackPlugin
} = require('@angular-devkit/build-angular/src/angular-cli-files/plugins/suppress-entry-chunks-webpack-plugin');
const {
    getOutputHashFormat
} = require('@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/utils');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devMode = process.env.NODE_ENV !== 'production';
const isGenerateSourceMap = devMode;
const hashFormat = getOutputHashFormat('all');

const config = {
    mode: devMode ? 'development' : 'production',
    context: projectRoot,
    resolve: {
        extensions: ['.ts', '.js']
    },
    entry: {
        main: path.resolve(projectRoot, './src/main.ts'),
        polyfills: path.resolve(projectRoot, './src/polyfills.ts'),
        styles: path.resolve(projectRoot, './src/styles.scss')
    },
    output: {
        path: path.resolve(workspaceRoot, './dist'),
        filename: devMode ? `[name].js` : `${hashFormat.chunk}`
    },
    plugins: [
        new IndexHtmlWebpackPlugin({
            input: path.resolve(__dirname, './src/index.html'),
            output: path.basename('./src/index.html'),
            // baseHref: buildOptions.baseHref,
            entrypoints: ['polyfills', 'sw-register', 'styles', 'main'],
            // deployUrl: buildOptions.deployUrl,
            sri: false
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
        }),
        // new SuppressExtractedTextChunksWebpackPlugin(),
        new ngToolsWebpack.AngularCompilerPlugin({
            tsConfigPath: path.resolve(projectRoot, './src/tsconfig.app.json'),
            mainPath: path.resolve(projectRoot, './src/main.ts'),
            hostReplacementPaths: {
                './src/environments/environment.ts': './src/environments/environment.prod.ts'
            },
            sourceMap: true,
            compilerOptions: {}
        }),
        new ProgressPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                include: path.resolve(projectRoot, './src/styles.scss'),
                loaders: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'extracted',
                            sourceMap: isGenerateSourceMap
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isGenerateSourceMap,
                            precision: 8,
                            includePaths: []
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                exclude: [path.resolve(projectRoot, './src/styles.scss')],
                loaders: [
                    'raw-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'extracted',
                            sourceMap: isGenerateSourceMap
                        }
                    },
                    'sass-loader'
                ]
            },
            { test: /\.css$/, loader: 'raw-loader' },
            { test: /\.html$/, loader: 'raw-loader' },
            {
                // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
                // Removing this will cause deprecation warnings to appear.
                test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
                parser: { system: true }
            },
            // require.resolve is required only because of the monorepo structure here.
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                // test: /\.ts$/,
                loader: require.resolve('@ngtools/webpack')
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        port: 3000,
        proxy: require('./proxy.conf')
    },
    watch: true
};
// copy assets and favicon.ico
const assets = ['favicon.ico', 'assets/'];
const copyWebpackPluginPatterns = assets.map(asset => {
    return {
        from: `src/${asset}`,
        to: asset.includes('.') ? '' : asset
    };
});
const copyWebpackPluginOptions = {
    ignore: ['.gitkeep', '**/.DS_Store', '**/Thumbs.db']
};

const copyWebpackPluginInstance = new CopyWebpackPlugin(copyWebpackPluginPatterns, copyWebpackPluginOptions);
config.plugins.push(copyWebpackPluginInstance);

module.exports = config;
