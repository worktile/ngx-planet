import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { PlanetPortalApplication } from './application/portal-application';


export interface IPlanetApplicationRef {
    bootstrap(app: PlanetPortalApplication): void;
    onRouteChange(event: PlanetRouterEvent): void;
    destroy(): void;
}

export interface PlanetOptions {
    preload?: boolean;
    switchMode?: SwitchModes;
    errorHandler: (error: Error) => void;
}

export interface PlanetApplication {
    name: string;
    // 应用加载的宿主元素或者选择器
    host: string | HTMLElement;
    // 子应用的选择器
    selector: string;
    // 子应用路由前缀路径
    routerPathPrefix: string;
    // 宿主元素附加样式
    hostClass?: string | string[];
    // 是否需要预加载
    preload?: boolean;
    // 切换应用的模式
    switchMode?: SwitchModes;
    // 样式资源加载前缀
    stylePathPrefix?: string;
    // 样式资源文件
    styles?: string[];
    // 脚本资源加载前缀
    scriptPathPrefix?: string;
    // 脚本资源文件
    scripts?: string[];
}


export enum SwitchModes {
    default = 'default',
    coexist = 'coexist'
}

export interface PlanetRouterEvent {
    url: string;
}
