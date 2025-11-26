import { Injectable } from '@angular/core';
import { cache } from '@demo/common';
import { SwitchModes } from '@worktile/planet';
const SETTINGS_KEY = 'custom-settings';

export interface CustomSettingsInfo {
    app1: {
        preload: boolean;
        switchMode?: SwitchModes;
    };
    app2: {
        preload: boolean;
        switchMode?: SwitchModes;
    };
    standaloneApp: {
        preload: boolean;
        switchMode?: SwitchModes;
    };
}

const DEFAULT_SETTINGS: CustomSettingsInfo = {
    app1: {
        preload: false,
        switchMode: SwitchModes.default
    },
    app2: {
        preload: false,
        switchMode: SwitchModes.default
    },
    standaloneApp: {
        preload: false,
        switchMode: SwitchModes.default
    }
};

@Injectable({
    providedIn: 'root'
})
export class CustomSettingsService {
    get(): CustomSettingsInfo {
        const settings = cache.get<CustomSettingsInfo>(SETTINGS_KEY);
        return settings || JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    }

    save(settings: CustomSettingsInfo) {
        cache.set<CustomSettingsInfo>(SETTINGS_KEY, settings);
    }

    restore() {
        cache.set<CustomSettingsInfo>(SETTINGS_KEY, DEFAULT_SETTINGS);
    }
}
