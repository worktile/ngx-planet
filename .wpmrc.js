module.exports = {
    allowBranch: ['master', 'v0.*'],
    bumpFiles: ['package.json', 'package-lock.json', 'packages/planet/package.json'],
    tagPrefix: '',
    commitAll: true,
    header: 'Changelog\nAll notable changes to ngx-planet will be documented in this file.\n',
    hooks: {
        prepublish: 'npm run build',
        postreleaseBranch: 'git add .'
    }
};
