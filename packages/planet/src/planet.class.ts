import { InjectionToken } from '@angular/core';
import { Debug } from './debug';

export interface PlanetOptions {
    switchMode?: SwitchModes;
    errorHandler: (error: Error) => void;
    debugFactory?: Debug;
}

export interface PlanetApplicationEntry {
    basePath?: string;
    scripts?: string[];
    styles?: string[];
    manifest?: string;
}

export interface PlanetApplication<TExtra = any> {
    /**
     * Application name, e.g. "app1"
     */
    name: string;
    /**
     * Selector or Element which app host parent
     * 应用加载的宿主元素或者选择器
     */
    hostParent: string | HTMLElement;
    /**
     * Class name for host
     */
    hostClass?: string | string[];
    /**
     * Selector for sub application
     * 子应用的选择器
     * @deprecated please use new defineApplication to set selector
     */
    selector?: string;
    /**
     * Path prefix for sub application, e.g. '/app1'
     * 子应用路由前缀路径
     */
    routerPathPrefix: string | RegExp;
    /**
     * Preload enabled, default false, if enabled,the application will be loaded when idle in the background
     * 是否开启预加载，开启后会在后台提前加载此应用
     */
    preload?: boolean;
    /**
     * Sandbox enabled
     * 是否开启沙箱模式
     */
    sandbox?: boolean;
    /**
     * Switch application mode
     * default: will be destroyed when switch to other app
     * coexist: only hide app when switch to other app
     * 切换应用的模式
     */
    switchMode?: SwitchModes;
    /**
     * Style prefix, e.g. 'app1'
     * 样式前缀
     */
    stylePrefix?: string;
    /**
     * The entry of the micro application, e.g. '/static/app1/index.html'
     * If configured as string, it represents the entry html address of the micro application.  e.g. '/static/app1/index.html'
     * If configured as object, the value of manifest is the html address of the micro application
     *   entry.basePath: the base path of the entry, e.g. '/static/app1/'
     *   entry.manifest: the manifest of the entry, e.g. 'index.html' or 'assets-manifest.json'
     *   entry.scripts: the scripts of the entry, will get final scripts address by manifest and basePath
     *   entry.styles: the styles of the entry, will get final styles address by manifest and basePath
     */
    entry?: string | PlanetApplicationEntry;
    /**
     * Manifest json file path, e.g. /static/app1/assets-manifest.json
     * 应用程序打包后的脚本和样式文件替换
     * @deprecated Please use entry.manifest instead
     */
    manifest?: string;
    /**
     * Path prefix of scripts and styles, e.g. 'static/app1/'
     * 资源文件路径的前缀
     * @deprecated Please use entry.basePath instead
     */
    resourcePathPrefix?: string;
    /**
     * Style static resource paths
     * 样式资源文件
     * @deprecated Please use entry.styles instead
     */
    styles?: string[];
    /**
     * Scripts static resource paths
     * 脚本资源文件
     * @deprecated Please use entry.scripts instead
     */
    scripts?: string[];
    /**
     * Serial load scripts, default is parallel, only enable when the script has sequentially loaded dependency
     * 串行加载，默认并行加载脚本资源，仅当脚本资源有依赖关系时开启
     */
    loadSerial?: boolean;
    /**
     * 皮肤样式的路径
     */
    // themeStylesPath?: string;
    /**
     * Extra data for application
     * 附加数据，主要应用于业务，比如图标，子应用的颜色，显示名等个性化配置
     */
    extra?: TExtra;
}

export enum SwitchModes {
    default = 'default',
    coexist = 'coexist'
}

export interface PlanetRouterEvent {
    url: string;
}

const PLANET_APPLICATIONS = new InjectionToken<PlanetApplication>('PLANET_APPLICATIONS');

export { PLANET_APPLICATIONS };
