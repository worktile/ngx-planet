import { Injectable } from '@angular/core';

// @Injectable({
//     providedIn: 'root'
// })
export class AppRootContext {
    name: string;

    setName(name: string) {
        this.name = name;
    }
}
