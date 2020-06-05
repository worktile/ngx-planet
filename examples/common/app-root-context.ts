import { Injectable } from '@angular/core';

@Injectable()
export class AppRootContext {
    name: string;

    setName(name: string) {
        this.name = name;
    }
}
