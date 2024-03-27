/**
 * @type {import('@docgeni/core').DocgeniConfig}
 */
module.exports = {
    mode: 'full',
    title: 'Planet',
    description: '微前端解决方案',
    docsDir: 'docs',
    defaultLocale: 'zh-cn',
    repoUrl: 'https://github.com/worktile/ngx-planet',
    logoUrl: 'assets/images/planet.png',
    navs: [
        null,
        {
            title: '示例',
            path: 'http://planet-examples.ngnice.com',
            isExternal: true
        },
        {
            title: 'GitHub',
            path: 'https://github.com/worktile/ngx-planet',
            isExternal: true
        },
        {
            title: '更新日志',
            path: 'https://github.com/worktile/ngx-planet/blob/master/CHANGELOG.md',
            isExternal: true,
            locales: {
                'en-us': {
                    title: 'Changelog'
                }
            }
        }
    ],
    footer: 'Open-source MIT Licensed | Copyright © 2020-present<br />Powered by PingCode'
};
