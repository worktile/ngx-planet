import { InjectionToken } from '@angular/core';
import { Debug } from './debug';

export interface PlanetOptions {
    switchMode?: SwitchModes;
    errorHandler: (error: Error) => void;
    debugFactory?: Debug;
}

export interface PlanetApplication<TExtra = any> {
    name: string;
    // 应用加载的宿主元素或者选择器
    hostParent: string | HTMLElement;

    // 子应用的选择器
    /**
     * @deprecated please use new defineApplication to set selector
     */
    selector?: string;
    // 子应用路由前缀路径
    routerPathPrefix: string | RegExp;
    // 宿主元素附加样式
    hostClass?: string | string[];
    // 是否需要预加载
    preload?: boolean;
    // 是否开启沙箱
    sandbox?: boolean;
    // 切换应用的模式
    switchMode?: SwitchModes;
    // 资源文件路径的前缀
    resourcePathPrefix?: string;
    // 样式前缀
    stylePrefix?: string;
    // 样式资源文件
    styles?: string[];
    // 脚本资源文件
    scripts?: string[];
    // 串行加载，默认并行加载脚本资源
    loadSerial?: boolean;
    // 皮肤样式的路径
    themeStylesPath?: string;
    // 应用程序打包后的脚本和样式文件替换
    manifest?: string;
    // 附加数据，主要应用于业务，比如图标，子应用的颜色，显示名等个性化配置
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
