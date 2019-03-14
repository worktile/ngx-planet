const PROXY_CONFIG = {};

PROXY_CONFIG['/app1/static'] = {
    target: 'http://localhost:3001',
    pathRewrite: { '^/app1/static': '' },
    secure: false,
    changeOrigin: false
};

PROXY_CONFIG['/app2/static'] = {
    target: 'http://localhost:3002',
    pathRewrite: { '^/app2/static': '' },
    secure: false,
    changeOrigin: true
};

PROXY_CONFIG['/app3/static'] = {
    target: 'http://localhost:3003',
    pathRewrite: { '^/app3/static': '' },
    secure: false,
    changeOrigin: true
};


module.exports = PROXY_CONFIG;
