const roules = {
    rules: [
        {
            test: {},
            loader: 'raw-loader'
        },
        {
            test: {},
            loader: 'file-loader',
            options: {
                name: '[name].[ext]'
            }
        },
        {
            test: {},
            parser: {
                system: true
            }
        },
        {
            test: {}
        },
        {
            test: {},
            exclude: {},
            enforce: 'pre'
        },
        {
            exclude: ['/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/src/styles.scss'],
            test: {},
            use: [
                {
                    loader: 'raw-loader'
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'embedded',
                        sourceMap: 'inline'
                    }
                }
            ]
        },
        {
            exclude: ['/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/src/styles.scss'],
            test: {},
            use: [
                {
                    loader: 'raw-loader'
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'embedded',
                        sourceMap: 'inline'
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                        precision: 8,
                        includePaths: []
                    }
                }
            ]
        },
        {
            exclude: ['/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/src/styles.scss'],
            test: {},
            use: [
                {
                    loader: 'raw-loader'
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'embedded',
                        sourceMap: 'inline'
                    }
                },
                {
                    loader: 'less-loader',
                    options: {
                        sourceMap: true,
                        javascriptEnabled: true
                    }
                }
            ]
        },
        {
            exclude: ['/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/src/styles.scss'],
            test: {},
            use: [
                {
                    loader: 'raw-loader'
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'embedded',
                        sourceMap: 'inline'
                    }
                },
                {
                    loader: 'stylus-loader',
                    options: {
                        sourceMap: true,
                        paths: []
                    }
                }
            ]
        },
        {
            include: ['/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/src/styles.scss'],
            test: {},
            use: [
                '/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/@angular-devkit/build-angular/node_modules/mini-css-extract-plugin/dist/loader.js',
                '/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js',
                {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'extracted',
                        sourceMap: true
                    }
                }
            ]
        },
        {
            include: ['/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/src/styles.scss'],
            test: {},
            use: [
                '/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/@angular-devkit/build-angular/node_modules/mini-css-extract-plugin/dist/loader.js',
                '/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js',
                {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'extracted',
                        sourceMap: true
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                        precision: 8,
                        includePaths: []
                    }
                }
            ]
        },
        {
            include: ['/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/src/styles.scss'],
            test: {},
            use: [
                '/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/@angular-devkit/build-angular/node_modules/mini-css-extract-plugin/dist/loader.js',
                '/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js',
                {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'extracted',
                        sourceMap: true
                    }
                },
                {
                    loader: 'less-loader',
                    options: {
                        sourceMap: true,
                        javascriptEnabled: true
                    }
                }
            ]
        },
        {
            include: ['/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/src/styles.scss'],
            test: {},
            use: [
                '/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/@angular-devkit/build-angular/node_modules/mini-css-extract-plugin/dist/loader.js',
                '/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js',
                {
                    loader: 'postcss-loader',
                    options: {
                        ident: 'extracted',
                        sourceMap: true
                    }
                },
                {
                    loader: 'stylus-loader',
                    options: {
                        sourceMap: true,
                        paths: []
                    }
                }
            ]
        },
        {
            test: {},
            loader: '@ngtools/webpack'
        }
    ]
};
//   const pls = [
//     ProgressPlugin { profile: false, handler: undefined },
//     CircularDependencyPlugin {
//       options:
//        { exclude: /([\\\/]node_modules[\\\/])|(ngfactory\.js$)/,
//          failOnError: false,
//          onDetected: false,
//          cwd: '/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend' } },
//     IndexHtmlWebpackPlugin {
//       _options:
//        { input: '/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/src/index.html',
//          output: 'index.html',
//          entrypoints: [Array],
//          sri: false,
//          baseHref: undefined,
//          deployUrl: undefined } },
//     MiniCssExtractPlugin {
//       options: { filename: '[name].css', chunkFilename: '[name].css' } },
//     SuppressExtractedTextChunksWebpackPlugin {},
//     ]
