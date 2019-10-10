import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { ProjectService } from './projects.service';

@Injectable({
    providedIn: 'root'
})
export class ProjectResolver implements Resolve<any> {
    constructor(private projectService: ProjectService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot) {
        const projectId = route.params.id;
        return this.projectService.fetchProject(projectId);
    }
}
