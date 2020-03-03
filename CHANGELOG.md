# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.1.0](https://github.com/worktile/ngx-planet/compare/1.0.9...1.1.0) (2020-03-03)

### Features

-   **build:** bump angular to 8.x [#56](https://github.com/worktile/ngx-planet/issues/56) ([52d6bdf](https://github.com/worktile/ngx-planet/commit/52d6bdf295272b6a04f2f7d7dfd4f8230f4fc370))
-   **component-loader:** load component support preload appliction ([f1f4a4e](https://github.com/worktile/ngx-planet/commit/f1f4a4ea9b02d4e8875080d44fe68e1a817ca7df))
-   **demo:** support lazy loading route (app1's user module) [#55](https://github.com/worktile/ngx-planet/issues/55) ([4b78b78](https://github.com/worktile/ngx-planet/commit/4b78b782c4d6e0c616e3dda06d2167916cbfaae5))

<a name="1.0.9"></a>

## [1.0.9](https://github.com/worktile/ngx-planet/compare/1.0.7...1.0.9) (2019-11-11)

### Bug Fixes

-   **app-loader:** should call error handler in ngZone, add test by way ([164adfc](https://github.com/worktile/ngx-planet/commit/164adfc))
-   **planet:** should reroute once when start planet ([7f1bb3b](https://github.com/worktile/ngx-planet/commit/7f1bb3b))
-   **planet-application-service:** fix match router path ([1571f82](https://github.com/worktile/ngx-planet/commit/1571f82))

<a name="1.0.8"></a>

## [1.0.8](https://github.com/worktile/ngx-planet/compare/1.0.7...1.0.8) (2019-10-15)

### Bug Fixes

-   **app-loader:** should call error handler in ngZone, add test by way ([164adfc](https://github.com/worktile/ngx-planet/commit/164adfc))
-   **planet:** should reroute once when start planet ([7f1bb3b](https://github.com/worktile/ngx-planet/commit/7f1bb3b))

<a name="1.0.7"></a>

## [1.0.7](https://github.com/worktile/ngx-planet/compare/1.0.6...1.0.7) (2019-10-11)

### Bug Fixes

-   **app-loader:** backwards compatibility get current url, add test cases ([bd754e4](https://github.com/worktile/ngx-planet/commit/bd754e4))

<a name="1.0.6"></a>

## [1.0.6](https://github.com/worktile/ngx-planet/compare/1.0.5...1.0.6) (2019-10-10)

### Bug Fixes

-   portal route change out ngZone when sub app route trigger change ([c2a5a66](https://github.com/worktile/ngx-planet/commit/c2a5a66))

<a name="1.0.5"></a>

## [1.0.5](https://github.com/worktile/ngx-planet/compare/1.0.4...1.0.5) (2019-10-10)

### Bug Fixes

-   **app-loader:** should navigate when reroute active app [#267024](https://github.com/worktile/ngx-planet/issues/267024) ([34bdc1a](https://github.com/worktile/ngx-planet/commit/34bdc1a))
-   **app-loader:** should not circulate redirect apps ([a009a6a](https://github.com/worktile/ngx-planet/commit/a009a6a))

### Code Refactoring

-   **planet:** rename app's host to hostParent, add settings for demo ([1bdb21e](https://github.com/worktile/ngx-planet/commit/1bdb21e))

### Features

-   **empty:** add empty component [#265875](https://github.com/worktile/ngx-planet/issues/265875) ([41f5ddd](https://github.com/worktile/ngx-planet/commit/41f5ddd))

### BREAKING CHANGES

-   **planet:** should change host to hostParent when register app

<a name="1.0.4"></a>

## [1.0.4](https://github.com/worktile/ngx-planet/compare/1.0.3...1.0.4) (2019-09-25)

### Bug Fixes

-   **app:** can't start when url is same, don't reload active app [#265669](https://github.com/worktile/ngx-planet/issues/265669) ([af61eb4](https://github.com/worktile/ngx-planet/commit/af61eb4))

<a name="1.0.3"></a>

## [1.0.3](https://github.com/worktile/ngx-micro-frontend/compare/1.0.1...1.0.3) (2019-09-25)

### Features

-   **app-ref:** sync portal route when route change, rename navigateByUrl ([dc104f9](https://github.com/worktile/ngx-micro-frontend/commit/dc104f9))
-   **application:** add active status, appsLoadingStart event for loader ([c09f7d7](https://github.com/worktile/ngx-micro-frontend/commit/c09f7d7))

### BREAKING CHANGES

Rename `onRouteChange` to `navigateByUrl` in PlanetApplicationRef, please upgrade planet to 1.0.3 in portal and sub apps at the same. if you are only upgrade planet in portal, it will throw error `navigateByUrl is undefined`.

<a name="1.0.2"></a>

## [1.0.2](https://github.com/worktile/ngx-micro-frontend/compare/1.0.1...1.0.2) (2019-09-18)

### Bug Fixes

-   **app-loader:** should call errorHandle when preload app assets failed ([f043018](https://github.com/worktile/ngx-micro-frontend/commit/f043018))

<a name="1.0.1"></a>

## [1.0.1](https://github.com/worktile/ngx-micro-frontend/compare/1.0.0...1.0.1) (2019-09-16)

### Bug Fixes

-   **application:** should reload last fail app which status is loadError ([a28b97f](https://github.com/worktile/ngx-micro-frontend/commit/a28b97f))
-   **application:** should trigger next route change when last throw error ([75b3ca3](https://github.com/worktile/ngx-micro-frontend/commit/75b3ca3))

<a name="1.0.0"></a>

# [1.0.0](https://github.com/worktile/ngx-micro-frontend/compare/0.0.11...1.0.0) (2019-09-16)

### Bug Fixes

-   **application:** cancel bootstrapped app when next change [#264544](https://github.com/worktile/ngx-micro-frontend/issues/264544) ([8a997a9](https://github.com/worktile/ngx-micro-frontend/commit/8a997a9))

### Features

-   **application:** support simultaneous load and rendering multiple applications
-   **application:** cancel last app loader which asserts is loading when next route change ([d737713](https://github.com/worktile/ngx-micro-frontend/commit/d737713))

<a name="0.0.11"></a>

## [0.0.11](https://github.com/worktile/ngx-micro-frontend/compare/0.0.10...0.0.11) (2019-08-16)

### Features

-   **manifest:** load manifest file don't use resource prefix ([40dee5f](https://github.com/worktile/ngx-micro-frontend/commit/40dee5f))
