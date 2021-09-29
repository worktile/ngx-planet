# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [12.1.0](https://github.com/worktile/ngx-planet/compare/12.0.0...12.1.0) (2021-09-29)


### Bug Fixes

* update peerDependencies to 12.0.0 ([4ff9f6d](https://github.com/worktile/ngx-planet/commit/4ff9f6d9f3532d9be3aa6f9b66e8b48c0592076a))


### Features

* **sandbox:** support proxy sandbox ([#208](https://github.com/worktile/ngx-planet/issues/208)) ([d281bf8](https://github.com/worktile/ngx-planet/commit/d281bf8d7d3ceb0724bcdfbaf0b8c8fb87750961))



<a name="12.0.0"></a>
# [12.0.0](https://github.com/worktile/ngx-planet/compare/10.0.0...12.0.0) (2021-06-24)


### Bug Fixes

* **app-loader:** add hack isInAngularZoneisInAngularZone for resolve error  Expected to not be in Angular Zone, but it is! [#197](https://github.com/worktile/ngx-planet/issues/197) ([14c6f9d](https://github.com/worktile/ngx-planet/commit/14c6f9d))
* **app-loader:** should active subapp when subapp is bootstrapping by preload #OSP-127 ([db1f4f9](https://github.com/worktile/ngx-planet/commit/db1f4f9)), closes [#OSP-127](https://github.com/worktile/ngx-planet/issues/OSP-127)


### Features

* **app-loader:** add debug log for app loader #OSP-129 ([#191](https://github.com/worktile/ngx-planet/issues/191)) ([ed2621d](https://github.com/worktile/ngx-planet/commit/ed2621d)), closes [#OSP-129](https://github.com/worktile/ngx-planet/issues/OSP-129)
* **planet:** add debug integration #OSP-128 ([7e653f1](https://github.com/worktile/ngx-planet/commit/7e653f1)), closes [#OSP-128](https://github.com/worktile/ngx-planet/issues/OSP-128)



## [11.0.0](https://github.com/worktile/ngx-planet/compare/10.0.0...11.0.0) (2021-05-21)


### Features

* **app-loader:** add debug log for app loader #OSP-129 ([#191](https://github.com/worktile/ngx-planet/issues/191)) ([ed2621d](https://github.com/worktile/ngx-planet/commit/ed2621d2702a4b5b5179782de96ca96907e27c77)), closes [#OSP-129](https://github.com/worktile/ngx-planet/issues/OSP-129)
* **planet:** add debug integration #OSP-128 ([7e653f1](https://github.com/worktile/ngx-planet/commit/7e653f155f73738658b3d0680fd0eb34e75e5cf6)), closes [#OSP-128](https://github.com/worktile/ngx-planet/issues/OSP-128)


### Bug Fixes

* **app-loader:** should active subapp when subapp is bootstrapping by preload #OSP-127 ([db1f4f9](https://github.com/worktile/ngx-planet/commit/db1f4f9eea9eb7d98cb9d768ab47fbe50f8cda3b)), closes [#OSP-127](https://github.com/worktile/ngx-planet/issues/OSP-127)

## [10.0.0](https://github.com/worktile/ngx-planet/compare/9.1.0...10.0.0) (2021-05-20)


### Features

* update angular and ngx-tethys to 10.x ([#167](https://github.com/worktile/ngx-planet/issues/167)) ([dc110df](https://github.com/worktile/ngx-planet/commit/dc110df7459c37edadf5da5c7eed5b22fcae4994))

## [9.2.0](https://github.com/worktile/ngx-planet/compare/9.1.0...9.2.0) (2021-05-20)


### Features

* update angular and ngx-tethys to 10.x ([#167](https://github.com/worktile/ngx-planet/issues/167)) ([dc110df](https://github.com/worktile/ngx-planet/commit/dc110df7459c37edadf5da5c7eed5b22fcae4994))

## [9.1.0](https://github.com/worktile/ngx-planet/compare/9.0.6...9.1.0) (2020-12-28)


### Features

* support style isolation ([#166](https://github.com/worktile/ngx-planet/issues/166)) ([5a6d6e0](https://github.com/worktile/ngx-planet/commit/5a6d6e0d5aee5e933e2484dae70b82f9ab429cb5))

### [9.0.6](https://github.com/worktile/ngx-planet/compare/9.0.2...9.0.6) (2020-12-17)


### Bug Fixes

* **app-loader:** should not set loading when app assets is loaded [#107](https://github.com/worktile/ngx-planet/issues/107) ([09a3f2e](https://github.com/worktile/ngx-planet/commit/09a3f2e8eca2a69d0afbad183aa82390a27bed15))
* **app-loader:** should throw specify error when sub app not found in bootstrapApp [#113](https://github.com/worktile/ngx-planet/issues/113) ([#158](https://github.com/worktile/ngx-planet/issues/158)) ([20deb37](https://github.com/worktile/ngx-planet/commit/20deb37217fc60804aa7a3331780148ef6fc2e1a))
* **component:** add TComp generic for component load type ([c53e105](https://github.com/worktile/ngx-planet/commit/c53e10581a2a5bd5bc5e05d3cf88f3629493914a))
* **component:** load component set TComp as first ([a7f79ce](https://github.com/worktile/ngx-planet/commit/a7f79ce7af0978a89b1e2532f34f8d501360aada))
* **planet-component-loader:** move delay to load function and replace delay with delayWhen [#159](https://github.com/worktile/ngx-planet/issues/159) ([fbc5610](https://github.com/worktile/ngx-planet/commit/fbc5610d7451c3c4a5b84f1192b2e5217a8ad327))
* resolve error Expected to not be in Angular Zone, but it is! ([d51fb8f](https://github.com/worktile/ngx-planet/commit/d51fb8f074012ead1cb7a5ff8ac215c65ce30b28))

### [9.0.5](https://github.com/worktile/ngx-planet/compare/9.0.2...9.0.5) (2020-12-17)


### Bug Fixes

* **app-loader:** should not set loading when app assets is loaded [#107](https://github.com/worktile/ngx-planet/issues/107) ([09a3f2e](https://github.com/worktile/ngx-planet/commit/09a3f2e8eca2a69d0afbad183aa82390a27bed15))
* **app-loader:** should throw specify error when sub app not found in bootstrapApp [#113](https://github.com/worktile/ngx-planet/issues/113) ([#158](https://github.com/worktile/ngx-planet/issues/158)) ([20deb37](https://github.com/worktile/ngx-planet/commit/20deb37217fc60804aa7a3331780148ef6fc2e1a))
* **component:** add TComp generic for component load type ([c53e105](https://github.com/worktile/ngx-planet/commit/c53e10581a2a5bd5bc5e05d3cf88f3629493914a))
* **component:** move delay to load function and replace delay with delayWhen [#159](https://github.com/worktile/ngx-planet/issues/159) ([fbc5610](https://github.com/worktile/ngx-planet/commit/fbc5610d7451c3c4a5b84f1192b2e5217a8ad327))
* resolve error Expected to not be in Angular Zone, but it is! ([d51fb8f](https://github.com/worktile/ngx-planet/commit/d51fb8f074012ead1cb7a5ff8ac215c65ce30b28))

### [9.0.4](https://github.com/worktile/ngx-planet/compare/9.0.2...9.0.4) (2020-12-12)


### Bug Fixes

* resolve error Expected to not be in Angular Zone, but it is! ([d51fb8f](https://github.com/worktile/ngx-planet/commit/d51fb8f074012ead1cb7a5ff8ac215c65ce30b28))
* **app-loader:** should not set loading when app assets is loaded [#107](https://github.com/worktile/ngx-planet/issues/107) ([09a3f2e](https://github.com/worktile/ngx-planet/commit/09a3f2e8eca2a69d0afbad183aa82390a27bed15))

### [9.0.3](https://github.com/worktile/ngx-planet/compare/9.0.2...9.0.3) (2020-12-12)


### Bug Fixes

* **app-loader:** should not set loading when app assets is loaded [#107](https://github.com/worktile/ngx-planet/issues/107) ([09a3f2e](https://github.com/worktile/ngx-planet/commit/09a3f2e8eca2a69d0afbad183aa82390a27bed15))

### [9.0.2](https://github.com/worktile/ngx-planet/compare/9.0.1-beta.3...9.0.2) (2020-12-10)


### Bug Fixes

* **application-loader:** fix preload app load component not display ([0a3abd2](https://github.com/worktile/ngx-planet/commit/0a3abd2f139bf66ed08587f87477d201414ddffa))
* **application-loader:** remove debug logs, fix preload app load component ([#153](https://github.com/worktile/ngx-planet/issues/153)) ([24413e6](https://github.com/worktile/ngx-planet/commit/24413e6a164b0206949335d92faf3bf5df199ead))

### [9.0.1-beta.6](https://github.com/worktile/ngx-planet/compare/9.0.1-beta.3...9.0.1-beta.6) (2020-12-10)


### Bug Fixes

* **application-loader:** fix preload app load component not display ([0a3abd2](https://github.com/worktile/ngx-planet/commit/0a3abd2f139bf66ed08587f87477d201414ddffa))

### [9.0.1-beta.5](https://github.com/worktile/ngx-planet/compare/9.0.1-beta.3...9.0.1-beta.5) (2020-12-10)


### Bug Fixes

* **application-loader:** fix preload app load component not display ([0a3abd2](https://github.com/worktile/ngx-planet/commit/0a3abd2f139bf66ed08587f87477d201414ddffa))

### [9.0.1-beta.4](https://github.com/worktile/ngx-planet/compare/9.0.1-beta.3...9.0.1-beta.4) (2020-12-10)


### Bug Fixes

* **application-loader:** fix preload app load component not display ([0a3abd2](https://github.com/worktile/ngx-planet/commit/0a3abd2f139bf66ed08587f87477d201414ddffa))

### [9.0.1-beta.3](https://github.com/worktile/ngx-planet/compare/9.0.1-beta.2...9.0.1-beta.3) (2020-12-09)


### Bug Fixes

* **application-loader:** fix preload error when app assetsLoaded ([e1fba40](https://github.com/worktile/ngx-planet/commit/e1fba402b0e72884f07cd6f7454b224f507c8610))

### [9.0.1-beta.2](https://github.com/worktile/ngx-planet/compare/1.2.3...9.0.1-beta.2) (2020-12-09)


### Features

* asset-loader,application-loader,component-loader, preload add debug logs ([#142](https://github.com/worktile/ngx-planet/issues/142)) ([2e21ab0](https://github.com/worktile/ngx-planet/commit/2e21ab09d6f9b9ab19825148f586a650704a12b5))
* release  9.0.1-beta.0 for debug ([23a305b](https://github.com/worktile/ngx-planet/commit/23a305b85d6cbf9a0ba08b7f6e7c8aa60e4fc66c))


### Bug Fixes

* **application-loader:** when load preloaded component, bootstrap directly ([3a50f1a](https://github.com/worktile/ngx-planet/commit/3a50f1a21350f87d63c769017e238c7e5e42f7fb))
* update peerDependencies to 9.0.0 ([a0e3c1b](https://github.com/worktile/ngx-planet/commit/a0e3c1b847faf9cf79b463f6ac993e260897f412))

### [9.0.1-beta.1](https://github.com/worktile/ngx-planet/compare/1.2.3...9.0.1-beta.1) (2020-12-09)


### Features

* asset-loader,application-loader,component-loader, preload add debug logs ([#142](https://github.com/worktile/ngx-planet/issues/142)) ([2e21ab0](https://github.com/worktile/ngx-planet/commit/2e21ab09d6f9b9ab19825148f586a650704a12b5))
* release  9.0.1-beta.0 for debug ([23a305b](https://github.com/worktile/ngx-planet/commit/23a305b85d6cbf9a0ba08b7f6e7c8aa60e4fc66c))


### Bug Fixes

* **application-loader:** when load preloaded component, bootstrap directly ([3a50f1a](https://github.com/worktile/ngx-planet/commit/3a50f1a21350f87d63c769017e238c7e5e42f7fb))
* update peerDependencies to 9.0.0 ([a0e3c1b](https://github.com/worktile/ngx-planet/commit/a0e3c1b847faf9cf79b463f6ac993e260897f412))

### [9.0.1-beta.0](https://github.com/worktile/ngx-planet/compare/1.2.3...9.0.1-beta.0) (2020-12-09)


### Features

* asset-loader,application-loader,component-loader, preload add debug logs ([#142](https://github.com/worktile/ngx-planet/issues/142)) ([2e21ab0](https://github.com/worktile/ngx-planet/commit/2e21ab09d6f9b9ab19825148f586a650704a12b5))


### Bug Fixes

* update peerDependencies to 9.0.0 ([a0e3c1b](https://github.com/worktile/ngx-planet/commit/a0e3c1b847faf9cf79b463f6ac993e260897f412))
* **application-loader:** when load preloaded component, bootstrap directly ([3a50f1a](https://github.com/worktile/ngx-planet/commit/3a50f1a21350f87d63c769017e238c7e5e42f7fb))

## [9.0.0](https://github.com/worktile/ngx-planet/compare/1.2.3...9.0.0) (2020-12-09)


### Bug Fixes

* update peerDependencies to 9.0.0 ([a0e3c1b](https://github.com/worktile/ngx-planet/commit/a0e3c1b847faf9cf79b463f6ac993e260897f412))
* **application-loader:** when load preloaded component, bootstrap directly ([3a50f1a](https://github.com/worktile/ngx-planet/commit/3a50f1a21350f87d63c769017e238c7e5e42f7fb))

### [1.2.4](https://github.com/worktile/ngx-planet/compare/1.2.3...1.2.4) (2020-11-21)


### Bug Fixes

* **application-loader:** when load preloaded component, bootstrap directly ([3a50f1a](https://github.com/worktile/ngx-planet/commit/3a50f1a21350f87d63c769017e238c7e5e42f7fb))

### [1.2.3](https://github.com/worktile/ngx-planet/compare/1.2.2...1.2.3) (2020-11-18)

### [1.2.2](https://github.com/worktile/ngx-planet/compare/1.2.1...1.2.2) (2020-11-18)


### Bug Fixes

* **component-loader:** fix load component error  when  preload app ([edd4ea3](https://github.com/worktile/ngx-planet/commit/edd4ea3489e7a066bf7cbcc2bbcf50288178b1fc))

### [1.2.1](https://github.com/worktile/ngx-planet/compare/1.1.2...1.2.1) (2020-11-09)


### Features

* **global-planet:** simplify sub application's definition [#58](https://github.com/worktile/ngx-planet/issues/58) ([#131](https://github.com/worktile/ngx-planet/issues/131)) ([b738b26](https://github.com/worktile/ngx-planet/commit/b738b26e4ba6cff0724f18d1df601beaa32f22a5))
* **planet:** add stop feature to planet service ([#117](https://github.com/worktile/ngx-planet/issues/117)) ([eb9c93a](https://github.com/worktile/ngx-planet/commit/eb9c93a963bca7bff6b19838986b5844d2c89f4c))


### Bug Fixes

* **component-loader:** fix load component error when  prod env [#132](https://github.com/worktile/ngx-planet/issues/132) ([30540b2](https://github.com/worktile/ngx-planet/commit/30540b2bf748cb9218e970ab1eb522b54f45ea4d))
* **planet:** should load sub app when route redirectTo to sub app [#108](https://github.com/worktile/ngx-planet/issues/108) ([#111](https://github.com/worktile/ngx-planet/issues/111)) ([6ddd143](https://github.com/worktile/ngx-planet/commit/6ddd143e89388d918363ef279674e2d703e69ebc))

## [1.2.0](https://github.com/worktile/ngx-planet/compare/1.1.2...1.2.0) (2020-07-30)


### Features

* **planet:** add stop feature to planet service ([#117](https://github.com/worktile/ngx-planet/issues/117)) ([eb9c93a](https://github.com/worktile/ngx-planet/commit/eb9c93a963bca7bff6b19838986b5844d2c89f4c))


### Bug Fixes

* **planet:** should load sub app when route redirectTo to sub app [#108](https://github.com/worktile/ngx-planet/issues/108) ([#111](https://github.com/worktile/ngx-planet/issues/111)) ([6ddd143](https://github.com/worktile/ngx-planet/commit/6ddd143e89388d918363ef279674e2d703e69ebc))

### [1.1.3](https://github.com/worktile/ngx-planet/compare/1.1.2...1.1.3) (2020-07-11)


### Bug Fixes

* **planet:** should load sub app when route redirectTo to sub app [#108](https://github.com/worktile/ngx-planet/issues/108) ([#111](https://github.com/worktile/ngx-planet/issues/111)) ([6ddd143](https://github.com/worktile/ngx-planet/commit/6ddd143e89388d918363ef279674e2d703e69ebc))

### [1.1.2](https://github.com/worktile/ngx-planet/compare/1.1.1...1.1.2) (2020-05-19)

### Bug Fixes

-   **component-loader:** fix component register after load bug ([faaa57d](https://github.com/worktile/ngx-planet/commit/faaa57db341baf85d8691e8b96d4fce0789d95bb))

### [1.1.1](https://github.com/worktile/ngx-planet/compare/1.1.0...1.1.1) (2020-05-19)

### Features

-   ensure global services only be injected once [#95](https://github.com/worktile/ngx-planet/issues/95) ([0652bac](https://github.com/worktile/ngx-planet/commit/0652bacd8c280c21befb18d1b94033792d14d599))
-   **component-loader:** support set wrapper class ([bbdab9d](https://github.com/worktile/ngx-planet/commit/bbdab9d9ef43a55db6e20d7fae97a390e813d623))

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
