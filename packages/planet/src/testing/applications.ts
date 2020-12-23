import { SwitchModes } from '../planet.class';
const app1 = {
    name: 'app1',
    hostParent: '.host-selector',
    selector: 'app1-root',
    stylePrefix: 'app1-prefix',
    routerPathPrefix: '/app1',
    hostClass: 'app1-host',
    preload: false,
    switchMode: SwitchModes.default,
    resourcePathPrefix: '/static/app1/',
    styles: ['styles/main.css'],
    scripts: ['vendor.js', 'main.js'],
    loadSerial: false,
    manifest: '',
    extra: {
        appName: '应用1'
    }
};

const app1WithManifest = {
    ...app1,
    manifest: '/static/app/manifest.json'
};

const app1WithPreload = {
    ...app1,
    preload: true
};

const app2 = {
    name: 'app2',
    hostParent: '.host-selector',
    selector: 'app2-root',
    routerPathPrefix: '/app2',
    hostClass: 'app2-host',
    preload: false,
    switchMode: SwitchModes.coexist,
    resourcePathPrefix: '/static/app2',
    styles: ['styles/main.css'],
    scripts: ['vendor.js', 'main.js'],
    loadSerial: false,
    extra: {
        appName: '应用2'
    }
};

const app2WithManifest = {
    ...app2,
    manifest: '/static/app/manifest.json'
};

const app2WithPreload = {
    ...app2,
    preload: true
};

export { app1, app1WithManifest, app1WithPreload, app2, app2WithManifest, app2WithPreload };
