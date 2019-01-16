(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["app1"] = factory();
	else
		root["app1"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./examples/app1/src/app/module.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./examples/app1/src/app/module.ts":
/*!*****************************************!*\
  !*** ./examples/app1/src/app/module.ts ***!
  \*****************************************/
/*! exports provided: AppModule */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed (from ./node_modules/@ngtools/webpack/src/index.js):\\nError: ENOENT: no such file or directory, open '/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/examples/app1/src/app/module.ts'\\n    at Object.fs.openSync (fs.js:646:18)\\n    at Object.fs.readFileSync (fs.js:551:33)\\n    at Storage.provideSync (/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:98:13)\\n    at CachedInputFileSystem.readFileSync (/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:259:32)\\n    at Observable.rxjs_1.Observable.obs [as _subscribe] (/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/@ngtools/webpack/src/webpack-input-host.js:35:51)\\n    at Observable._trySubscribe (/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/rxjs/internal/Observable.js:44:25)\\n    at Observable.subscribe (/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/rxjs/internal/Observable.js:30:22)\\n    at SyncDelegateHost._doSyncCall (/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/@angular-devkit/core/src/virtual-fs/host/sync.js:22:20)\\n    at SyncDelegateHost.read (/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/@angular-devkit/core/src/virtual-fs/host/sync.js:49:21)\\n    at WebpackCompilerHost.readFileBuffer (/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/@ngtools/webpack/src/compiler_host.js:124:44)\\n    at VirtualFileSystemDecorator.readFile (/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/@ngtools/webpack/src/virtual_file_system_decorator.js:39:54)\\n    at processResource (/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/loader-runner/lib/LoaderRunner.js:199:11)\\n    at iteratePitchingLoaders (/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/loader-runner/lib/LoaderRunner.js:158:10)\\n    at iteratePitchingLoaders (/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/loader-runner/lib/LoaderRunner.js:165:10)\\n    at /Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/loader-runner/lib/LoaderRunner.js:173:18\\n    at loadLoader (/Users/haifeng/IT/10_YC/atinc/ngx-micro-frontend/node_modules/loader-runner/lib/loadLoader.js:36:3)\");\n\n//# sourceURL=webpack://app1/./examples/app1/src/app/module.ts?");

/***/ })

/******/ });
});