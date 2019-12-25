const PROXY_CONFIG = {};

PROXY_CONFIG['/static/app1'] = {
    target: 'http://localhost:3001',
    // pathRewrite: { '^/static/app1': '' },
    secure: false,
    changeOrigin: false
};

PROXY_CONFIG['/static/app2'] = {
    target: 'http://localhost:3002',
    // pathRewrite: { '^/static/app2': '' },
    secure: false,
    changeOrigin: true
};

PROXY_CONFIG['/static/app3'] = {
    target: 'http://localhost:3003',
    pathRewrite: { '^/static/app3': '' },
    secure: false,
    changeOrigin: true
};

module.exports = PROXY_CONFIG;
