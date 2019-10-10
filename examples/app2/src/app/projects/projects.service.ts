import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

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

    fetchProject(projectId: string) {
        return of({
            id: projectId,
            name: `Data ${projectId}`,
            desc: 'This is test data'
        }).pipe(delay(100));
    }
}
