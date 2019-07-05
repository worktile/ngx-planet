import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    constructor() {}

    getProjects() {
        return Array.from({ length: 10 }).map((item, index) => {
            return {
                id: index,
                name: `Data ${index}`,
                desc: 'This is test data'
            };
        });
    }
}
