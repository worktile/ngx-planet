import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ProjectService } from './projects.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectResolver {
    private projectService = inject(ProjectService);

    constructor() {}

    resolve(route: ActivatedRouteSnapshot) {
        const projectId = route.params.id;
        return this.projectService.fetchProject(projectId);
    }
}
