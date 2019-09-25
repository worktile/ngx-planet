<a name="1.0.3"></a>

## [1.0.3](https://github.com/worktile/ngx-micro-frontend/compare/1.0.1...1.0.3) (2019-09-25)

### Bug Fixes

-   **app-loader:** should call errorHandle when preload app assets failed ([f043018](https://github.com/worktile/ngx-micro-frontend/commit/f043018))

### Features

-   **app-ref:** sync portal route when route change, rename navigateByUrl ([dc104f9](https://github.com/worktile/ngx-micro-frontend/commit/dc104f9))
-   **application:** add active status, appsLoadingStart event for loader ([c09f7d7](https://github.com/worktile/ngx-micro-frontend/commit/c09f7d7))

### BREAKING CHANGES

Rename `onRouteChange` to `navigateByUrl` in PlanetApplicationRef, please upgrade planet to 1.0.3 in portal and sub apps at the same. if you upgrade only in portal, it will throw error navigateByUrl is not defined.

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
