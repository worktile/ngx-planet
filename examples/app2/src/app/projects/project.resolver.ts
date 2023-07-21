import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { ProjectService } from './projects.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectResolver {
    constructor(private projectService: ProjectService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot) {
        const projectId = route.params.id;
        return this.projectService.fetchProject(projectId);
    }
}
