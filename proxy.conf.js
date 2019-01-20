const PROXY_CONFIG = {};

PROXY_CONFIG['/app1/assets'] = {
    target: 'http://localhost:3001',
    pathRewrite: { '^/app1/assets': '' },
    secure: false,
    changeOrigin: false
};

PROXY_CONFIG['/app2/assets'] = {
    target: 'http://localhost:3002',
    pathRewrite: { '^/app2/assets': '' },
    secure: false,
    changeOrigin: true
};

PROXY_CONFIG['/app3/assets'] = {
    target: 'http://localhost:3003',
    pathRewrite: { '^/app3/assets': '' },
    secure: false,
    changeOrigin: true
};


module.exports = PROXY_CONFIG;
